import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import {
  arrayDiff,
  buildMessagePayload,
  errorHasCode,
  formatDate,
  getDeviceTokens,
  requireParams,
} from "./utils/index";
import {
  BadgeId,
  BadgeIds,
  Challenge,
  ChallengeResults,
  DEFAULT_RATING,
  COINS_ACHEIVEMENT,
  Ratings,
  TriviaCategory,
  UserBadge,
  DailyTriviaResults,
  DailyTriviaStats,
  DAILY_TRIVIA_STREAK_ACHIEVEMENT,
  GameType,
  HotStreakType,
  HOTTER_STREAK_MULTIPLIER,
  HOT_STREAK_MULTIPLIER,
  TriviaActivity,
} from "./types/index";
import {
  updateRanks,
  getQuestion,
  createDailyTrivia,
  getDifficultyFromRating,
  createSession,
  getSession,
  getUserTriviaSession,
  getLatestDailyTriviaDate,
  addQuestionToSession,
  getUserTrivia,
  getTriviaCategoryName,
} from "./utils/trivia";
import {
  createChallenge,
  notifyChallengeAccepted,
  notifyChallengeCreated,
  notifyFinishedSelfQuestions,
  notifyFinishedSteal,
  notifyStartChallengeDeclined,
  notifyStartChallengeFailed,
} from "./utils/challenges";
import { awardRankBadges } from "./utils/badges";
import { generateTriviaQuestion } from "./utils/openaiTrivia";

const DAILY_TRIVIA_TOPIC = "daily-trivia-topic";

// INIT

admin.initializeApp({
  credential: applicationDefault(),
});

// FUNCTIONS

export const deleteAccount = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "2GB",
  })
  .https.onCall(async (data, context) => {
    // Only allow admin users to execute this function.
    if (!(context.auth && context.auth.uid)) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Login to delete your account"
      );
    }

    await admin.firestore().collection("Users").doc(context.auth.uid).delete();
    await admin
      .firestore()
      .collection("Ratings")
      .doc(context.auth.uid)
      .delete();
    await admin
      .firestore()
      .collection("DeviceTokens")
      .doc(context.auth.uid)
      .delete();
    await admin
      .firestore()
      .collection("PowerUps")
      .doc(context.auth.uid)
      .delete();
    await admin.firestore().collection("Coins").doc(context.auth.uid).delete();
    await admin.auth().deleteUser(context.auth.uid);
  });

export const onUserDeleted = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "2GB",
  })
  .firestore.document("Users/{userId}")
  .onDelete(async (snapshot, context) => {
    const userId = context.params.userId;

    const userDoc = admin.firestore().collection("Users").doc(userId);

    try {
      const badgesSnapshot = await userDoc.collection("Badges").get();
      const activitySnapshot = await userDoc.collection("Activity").get();
      const dailyTriviaStatsSnapshot = await userDoc
        .collection("DailyTriviaStats")
        .get();
      const dailyTriviaResultsSnapshot = await userDoc
        .collection("DailyTriviaResults")
        .get();

      await Promise.all(badgesSnapshot.docs.map((doc) => doc.ref.delete()));
      await Promise.all(activitySnapshot.docs.map((doc) => doc.ref.delete()));
      await Promise.all(
        dailyTriviaStatsSnapshot.docs.map((doc) => doc.ref.delete())
      );
      await Promise.all(
        dailyTriviaResultsSnapshot.docs.map((doc) => doc.ref.delete())
      );
    } catch (error) {
      console.error(error);
    }

    return null;
  });

export const createTriviaSession = functions.https.onCall(
  async (data, context) => {
    if (!context.auth?.uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Login to create a session."
      );
    }

    const session = await createSession();
    return session.id;
  }
);

export const loadTriviaSession = functions.https.onCall(
  async (data, context) => {
    if (!context.auth?.uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Login to create a session."
      );
    }

    const { id } = data;

    requireParams({ id });

    const session = await getSession(id);

    return session;
  }
);

export const loadAITrivia = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Login to get trivia."
    );
  }

  const { n } = data as {
    n: number;
  };

  requireParams({ n });

  const limit = n || 10;

  const savedTriviaSnapshot = await admin
    .firestore()
    .collection("TriviaQuestions")
    // .where(context.auth?.uid, "", "rated")
    .limit(limit)
    .get();

  const savedTrivia = savedTriviaSnapshot.docs.map((doc) => doc.data());

  if (savedTrivia.length === limit) {
    return savedTrivia;
  } else {
    const generatedTrivia = await Promise.all(
      new Array(limit - savedTrivia.length)
        .fill(0)
        .map(() => generateTriviaQuestion({}))
    );
    return [...generatedTrivia, ...savedTrivia];
  }
});

export const loadTrivia = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Login to get trivia."
    );
  }

  const { n, rating, category, gameType } = data as {
    n: number;
    rating: number;
    category: TriviaCategory | "random";
    gameType: GameType;
    preview?: boolean;
  };

  requireParams({ n, rating, category, gameType });

  const limit = n || 10;
  const categories = category === "random" ? undefined : [category];
  const difficulties = getDifficultyFromRating(rating);

  const trivia = await getUserTrivia(context.auth.uid, {
    limit,
    difficulties,
    categories,
    preview: true,
  });

  return trivia;
});

export const loadQuestion = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Login to get trivia."
    );
  }

  const { id } = data;

  requireParams({ id });

  const trivia = await getQuestion(id);

  return trivia;
});

export const startChallenge = functions
  .runWith({ timeoutSeconds: 120 })
  .https.onCall(async (data, context) => {
    if (!context.auth?.uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Login to store game result."
      );
    }

    const { uid } = context.auth;

    const { userId } = data;

    requireParams({ userId });

    try {
      const existingChallenges = await admin
        .firestore()
        .collection("Challenges")
        .where("users", "array-contains", uid)
        .get();

      console.log("Existing", existingChallenges.empty);

      if (!existingChallenges.empty) {
        if (
          existingChallenges.docs.find((doc) =>
            (doc.data() as Challenge).users.includes(userId)
          )
        ) {
          throw new functions.https.HttpsError(
            "already-exists",
            "You already have open challenge with this user."
          );
        }
      }

      const challenge: Challenge = await createChallenge({
        challenger: uid,
        opponent: userId,
      });

      return { challengeId: challenge.id };
    } catch (error) {
      console.error("Failed to start challenge: ", error);

      if (errorHasCode(error) && error.code !== "already-exists") {
        try {
          await notifyStartChallengeFailed(uid);
        } catch (err) {
          console.error("Failed to send failed challenge message: ", err);
        }
      } else {
        throw error;
      }
    }

    return null;
  });

export const onBadgesCreated = functions.firestore
  .document("Users/{userId}/Badges/{badgeId}")
  .onCreate(async (snapshot, context) => {
    const { userId, badgeId } = context.params;

    if (badgeId === BadgeIds.SMARTICUS) {
      return null;
    }

    try {
      const championBadges: BadgeId[] = [
        BadgeIds.ARTS_CHAMPION,
        BadgeIds.FOOD_CHAMPION,
        BadgeIds.GENERAL_CHAMPION,
        BadgeIds.GEOGRAPHY_CHAMPION,
        BadgeIds.HISTORY_CHAMPION,
        BadgeIds.MOVIES_CHAMPION,
        BadgeIds.MUSIC_CHAMPION,
        BadgeIds.SCIENCE_CHAMPION,
        BadgeIds.SOCIETY_CHAMPION,
        BadgeIds.SPORTS_CHAMPION,
      ];

      const badgesCollection = admin
        .firestore()
        .collection("Users")
        .doc(userId)
        .collection("Badges");
      const badgesSnapshot = await badgesCollection.get();
      const numberOfBadges = badgesSnapshot.size;

      if (numberOfBadges === Object.keys(BadgeIds).length - 1) {
        badgesCollection.doc(BadgeIds.SMARTICUS).set({
          badgeId: BadgeIds.SMARTICUS,
          achieved: true,
          collected: false,
          achievedTimestamp: Date.now(),
          collectedTimestamp: null,
          acknowledged: false,
        });
      } else if (
        championBadges.includes(badgeId as BadgeId) &&
        championBadges.every((badgeId) =>
          badgesSnapshot.docs.find((doc) => {
            const badge = doc.data() as UserBadge;
            return badge.badgeId === badgeId && badge.achieved === true;
          })
        )
      ) {
        badgesCollection.doc(BadgeIds.TRIVIA_MASTER).set({
          badgeId: BadgeIds.TRIVIA_MASTER,
          achieved: true,
          collected: false,
          achievedTimestamp: Date.now(),
          collectedTimestamp: null,
          acknowledged: false,
        });
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  });

export const onDailyTriviaResults = functions.firestore
  .document("Users/{userId}/DailyTriviaResults/{date}")
  .onUpdate(async (snapshot, context) => {
    const resultsBefore = snapshot.before.data() as
      | DailyTriviaResults
      | undefined;
    const resultsAfter = snapshot.after.data() as
      | DailyTriviaResults
      | undefined;

    if (!(resultsBefore && resultsAfter)) {
      return null;
    }

    const { date, userId } = context.params;
    const latestDailyTriviaDate = getLatestDailyTriviaDate();
    const formattedLatestTriviaDate = formatDate(latestDailyTriviaDate);

    console.log("date", date);
    console.log("formattedLatestTriviaDate", formattedLatestTriviaDate);

    if (date !== formattedLatestTriviaDate) {
      return null;
    }

    const completedBefore = Object.keys(resultsBefore.results).length;
    const completedAfter = Object.keys(resultsAfter.results).length;

    console.log("completedBefore", completedBefore);
    console.log("completedAfter", completedAfter);

    if (completedBefore < completedAfter && completedAfter === 5) {
      try {
        const dailyTriviaStatsRef = admin
          .firestore()
          .collection("Users")
          .doc(userId)
          .collection("DailyTriviaStats")
          .doc("stats");

        const dailyTriviaStatsDoc = await dailyTriviaStatsRef.get();
        const dailyTriviaStats = dailyTriviaStatsDoc.data() as
          | DailyTriviaStats
          | undefined;

        if (!dailyTriviaStats) {
          await dailyTriviaStatsRef.set({ lastDateCompleted: date, streak: 1 });
        } else {
          const lastDateCompleted = dailyTriviaStats.lastDateCompleted;

          if (lastDateCompleted) {
            // change latest date to yesterday and to check if lastDateCompleted was yesterday to add to streak
            latestDailyTriviaDate.setDate(latestDailyTriviaDate.getDate() - 1);
            const yesterdayFormatted = formatDate(latestDailyTriviaDate);
            const currentStreak = dailyTriviaStats.streak || 0;
            const nextStreak =
              yesterdayFormatted === lastDateCompleted ? currentStreak + 1 : 1;

            if (nextStreak === DAILY_TRIVIA_STREAK_ACHIEVEMENT) {
              const badgeRef = admin
                .firestore()
                .collection("Users")
                .doc(userId)
                .collection("Badges")
                .doc(BadgeIds.IRON_MAN);
              const dailyTriviaStreakBadgeDoc = await badgeRef.get();
              const dailyTriviaStreakBadge =
                dailyTriviaStreakBadgeDoc.data() as UserBadge | undefined;

              if (
                !(dailyTriviaStreakBadge && dailyTriviaStreakBadge.achieved)
              ) {
                await badgeRef.set({
                  badgeId: BadgeIds.IRON_MAN,
                  achieved: true,
                  collected: false,
                  achievedTimestamp: Date.now(),
                  collectedTimestamp: null,
                  acknowledged: false,
                });
              }
            }

            await dailyTriviaStatsRef.set({
              lastDateCompleted: date,
              streak: nextStreak,
            });
          } else {
            await dailyTriviaStatsRef.set({
              lastDateCompleted: date,
              streak: 1,
            });
          }
        }

        await admin
          .firestore()
          .collection("Users")
          .doc(context.params.userId)
          .collection("DailyTriviaStats")
          .doc("stats")
          .set({ lastDateCompleted: context.params.date }, { merge: true });
      } catch (error) {
        console.error(error);
      }
    }

    return null;
  });

export const onChallengeCreated = functions.firestore
  .document("Challenges/{docId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.data();

    if (!(data && data.opponent)) {
      console.log("No opponent");
      return null;
    }

    try {
      await notifyChallengeCreated(snapshot.id, data.opponent);
    } catch (error) {
      console.error(error);
    }

    return null;
  });

export const onChallengeUpdated = functions.firestore
  .document("Challenges/{docId}")
  .onWrite(async (snapshot) => {
    const challengeBefore = snapshot.before.data() as Challenge | undefined;
    const challengeAfter = snapshot.after.data() as Challenge | undefined;

    if (!(challengeBefore && challengeAfter)) {
      return null;
    }

    if (challengeBefore.users.length === 2 && challengeAfter.users.length < 2) {
      return snapshot.after.ref.delete();
    }

    const { challenger, opponent } = challengeAfter;

    if (!challengeBefore.accepted && challengeAfter.accepted) {
      try {
        await notifyChallengeAccepted(
          snapshot.after.id,
          challengeAfter.challenger
        );
      } catch (error) {
        console.error(error);
      }
    }

    const opponentResultsAfter: ChallengeResults =
      challengeAfter.results && challengeAfter.results[opponent]
        ? challengeAfter.results[opponent]
        : {};
    const challengerResultsAfter: ChallengeResults =
      challengeAfter.results && challengeAfter.results[challenger]
        ? challengeAfter.results[challenger]
        : {};

    if (!(opponentResultsAfter || challengerResultsAfter)) {
      return null;
    }

    const opponentFinishedQuestionsAfter =
      opponentResultsAfter &&
      !challengeAfter.trivia[opponent].find(
        (question) => !opponentResultsAfter[question.id]
      );
    const challengerFinishedQuestionsAfter =
      challengerResultsAfter &&
      !challengeAfter.trivia[challenger].find(
        (question) => !challengerResultsAfter[question.id]
      );

    if (!(opponentFinishedQuestionsAfter || challengerFinishedQuestionsAfter)) {
      return null;
    }

    const opponentResultsBefore: ChallengeResults =
      challengeBefore.results && challengeBefore.results[opponent]
        ? challengeBefore.results[opponent]
        : {};
    const challengerResultsBefore: ChallengeResults =
      challengeBefore.results && challengeBefore.results[challenger]
        ? challengeBefore.results[challenger]
        : {};

    const opponentFinishedQuestionsBefore =
      opponentResultsBefore &&
      !challengeBefore.trivia[opponent].find(
        (question) => !opponentResultsBefore[question.id]
      );
    const challengerFinishedQuestionsBefore =
      challengerResultsBefore &&
      !challengeBefore.trivia[challenger].find(
        (question) => !challengerResultsBefore[question.id]
      );

    if (!opponentFinishedQuestionsBefore && opponentFinishedQuestionsAfter) {
      // Notify challenger that opponent finished their questions
      try {
        await notifyFinishedSelfQuestions(snapshot.after.id, challenger);
      } catch (error) {
        console.error(error);
      }
    }

    if (
      !challengerFinishedQuestionsBefore &&
      challengerFinishedQuestionsAfter
    ) {
      // Notify opponent that challenger finished their questions
      try {
        await notifyFinishedSelfQuestions(snapshot.after.id, opponent);
      } catch (error) {
        console.error(error);
      }
    }

    const opponentStealQuestions =
      challengerFinishedQuestionsAfter && challengerResultsAfter
        ? challengeAfter.trivia[challenger].filter(
            (question) => challengerResultsAfter[question.id].correct === false
          )
        : [];
    const challengerStealQuestions =
      opponentFinishedQuestionsAfter && opponentResultsAfter
        ? challengeAfter.trivia[opponent].filter(
            (question) => opponentResultsAfter[question.id].correct === false
          )
        : [];

    if (!(opponentStealQuestions.length || challengerStealQuestions.length)) {
      return null;
    }

    const opponentFinishedStealAfter = challengerStealQuestions.length
      ? !challengerStealQuestions.find(
          (question) => !opponentResultsAfter[question.id]
        )
      : false;
    const challengerFinishedStealAfter = opponentStealQuestions.length
      ? !opponentStealQuestions.find(
          (question) => !challengerResultsBefore[question.id]
        )
      : false;

    if (!(opponentFinishedStealAfter || challengerFinishedStealAfter)) {
      return null;
    }

    const challengerFinishedStealBefore = opponentStealQuestions.length
      ? !opponentStealQuestions.find(
          (question) => !challengerResultsBefore[question.id]
        )
      : false;
    const opponentFinishedStealBefore = challengerStealQuestions.length
      ? !challengerStealQuestions.find(
          (question) => !opponentResultsBefore[question.id]
        )
      : false;

    if (!challengerFinishedStealBefore && challengerFinishedStealAfter) {
      // Notify opponent that challenger finished steal
      try {
        await notifyFinishedSteal(snapshot.after.id, opponent);
      } catch (error) {
        console.error(error);
      }
    }

    if (!opponentFinishedStealBefore && opponentFinishedStealAfter) {
      // Notify challenger that opponent finished steal
      try {
        await notifyFinishedSteal(snapshot.after.id, challenger);
      } catch (error) {
        console.error(error);
      }
    }

    return null;
  });

export const declineChallenge = functions.https.onCall(
  async (data, context) => {
    if (!context.auth?.uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Login to decline challenge"
      );
    }

    const { challengeId } = data;

    try {
      const challengeDoc = await admin
        .firestore()
        .collection("Challenges")
        .doc(challengeId)
        .get();
      const challenge = challengeDoc.data() as Challenge | undefined;

      if (!challenge) {
        return null;
      }

      await admin
        .firestore()
        .collection("Challenges")
        .doc(challengeId)
        .delete();

      await notifyStartChallengeDeclined(
        challenge.challenger,
        challenge.opponent
      );
    } catch (error) {
      console.error("Failed to decline challenge: ", error);
    }

    return null;
  }
);

export const onDispute = functions.firestore
  .document("Disputes/{id}")
  .onCreate(async (snapshot) => {
    const { userId, questionId } = snapshot.data();

    try {
      const userActivitySnap = await admin
        .firestore()
        .collection("Users")
        .doc(userId)
        .collection("Activity")
        .where("questionId", "==", questionId)
        .get();
      const userActivity =
        userActivitySnap &&
        userActivitySnap.docs &&
        userActivitySnap.docs[0] &&
        userActivitySnap.docs[0].data();

      if (!userActivity) {
        return null;
      }

      const { category, ratingChange, newRating } = userActivity;

      await admin
        .firestore()
        .collection("Ratings")
        .doc(userId)
        .set(
          {
            categories: { [category]: newRating - ratingChange },
            categoriesUpdated: Date.now(),
          },
          { merge: true }
        );
    } catch (error) {
      console.error("failed to finish dispute", error);
    }

    return null;
  });

/**
 * onRatingStored
 *
 * Updates rating total when rating is stored
 * Updates rank changes when ranks are changed
 * Award rank achievements
 */
export const onRatingStored = functions.firestore
  .document("Ratings/{userId}")
  .onWrite(async (snapshot, context) => {
    const { userId } = context.params;
    const dataBefore = snapshot.before.data() as Ratings | undefined;
    const dataAfter = snapshot.after.data() as Ratings | undefined;

    if (!dataAfter) {
      return null;
    }

    if (
      dataAfter.categories &&
      dataBefore?.categoriesUpdated !== dataAfter.categoriesUpdated
    ) {
      try {
        const overallValue = Object.entries(dataAfter.categories).reduce(
          (acc: number, [category, rating]) => {
            if (category === "overall") {
              return acc;
            }
            return acc + (rating as number);
          },
          0
        );

        await snapshot.after.ref.set(
          { categories: { overall: overallValue } },
          { merge: true }
        );
      } catch (error) {
        console.error("Failed to update overall category rating: ", error);
      }
    }

    if (
      dataAfter.ranks &&
      dataBefore?.ranksUpdated !== dataAfter.ranksUpdated
    ) {
      try {
        await awardRankBadges(dataBefore?.ranks, dataAfter?.ranks, userId);
      } catch (error) {
        console.error("Failed to award rank badges: ", error);
      }

      const changes = Object.entries(
        dataAfter.ranks as { [Property in TriviaCategory]?: number }
      ).reduce((acc, [category, rank]) => {
        const previousRank =
          dataBefore?.ranks?.[category as TriviaCategory] || 0;
        const change = previousRank ? previousRank - rank : rank;
        return { ...acc, [category]: change };
      }, {} as { [Property in TriviaCategory]?: number });

      try {
        await snapshot.after.ref.update({ changes });
      } catch (error) {
        console.error("Failed to update rank change: ", error);
      }

      try {
        if (!(dataBefore?.ranks && dataAfter?.ranks)) {
          return null;
        }

        const highestRankCategory = Object.entries(dataBefore.ranks)
          .sort(([aK, aVal], [bL, bVal]) => {
            return aVal - bVal;
          })
          .find(
            ([k, v]) => !!changes[k as TriviaCategory]
          )?.[0] as TriviaCategory;

        if (!highestRankCategory) {
          return null;
        }

        const highestRank = dataAfter.ranks[highestRankCategory];

        const highestRatingChange =
          highestRankCategory && changes[highestRankCategory];

        if (highestRatingChange) {
          const deviceTokens = await getDeviceTokens([userId]);

          const deviceToken = deviceTokens && deviceTokens[0];

          if (deviceToken) {
            const prevRating = dataBefore.ranks[highestRankCategory] || 0;

            const payload = buildMessagePayload(
              {
                title:
                  highestRatingChange < 0
                    ? prevRating === 1
                      ? "You have been dethroned!"
                      : "You have lost your rank!"
                    : "You have ranked up!",
                body:
                  highestRatingChange < 0
                    ? `Someone passed you on the leaderboard in ${getTriviaCategoryName(
                        highestRankCategory
                      )}. Even mighty warriors stumble. Play again to regain your strength, Smarticus!`
                    : `Your valor has elevated you to rank ${highestRank} in ${getTriviaCategoryName(
                        highestRankCategory
                      )}. Continue your relentless pursuit of knowledge and conquer the leaderboard!`,
              },
              { type: "rating-change" },
              "rating-change"
            );

            await admin.messaging().send({
              token: deviceToken,
              ...payload,
            });
          }
        }
      } catch (error) {
        console.error("Failed to alert rank change", error);
      }
    }

    return null;
  });

export const onCoinsUpdated = functions.firestore
  .document("Coins/{userId}")
  .onWrite(async (snapshot, context) => {
    const dataBefore = snapshot.before.data();
    const dataAfter = snapshot.after.data();

    const coinsBefore = dataBefore?.coins || 0;
    const coinsAfter = dataAfter?.coins || 0;

    const totalCoinsBefore = dataBefore?.totalCoinsPurchased || 0;
    const totalCoinsAfter = dataAfter?.totalCoinsPurchased || 0;

    if (coinsBefore !== coinsAfter && coinsAfter - coinsBefore > 0) {
      snapshot.after.ref.update({
        totalCoinsPurchased: totalCoinsAfter + coinsAfter - coinsBefore,
      });
    }

    if (
      totalCoinsBefore !== totalCoinsAfter &&
      totalCoinsBefore < COINS_ACHEIVEMENT &&
      totalCoinsAfter >= COINS_ACHEIVEMENT
    ) {
      const badgesRef = admin
        .firestore()
        .collection("Users")
        .doc(context.params.userId)
        .collection("Badges")
        .doc(BadgeIds.MONEY_BAGS);
      const badgeDoc = await badgesRef.get();
      const badge = badgeDoc.data() as UserBadge | undefined;
      if (!badge || !badge.achieved) {
        await badgesRef.set({
          badgeId: BadgeIds.MONEY_BAGS,
          achieved: true,
          collected: false,
          achievedTimestamp: Date.now(),
          collectedTimestamp: null,
          acknowledged: false,
        });
      }
    }
  });

/**
 * onUserCreated
 *
 * Adds free coins and power-ups for new users
 */
// export const onUserCreated = functions.firestore
//   .document("Users/{userId}")
//   .onCreate(async (snapshot, context) => {
//     try {
//       await admin
//         .firestore()
//         .collection("Coins")
//         .doc(context.params.userId)
//         .set({ coins: 10 });
//     } catch (error) {
//       console.error("Failed to add initial coins: ", error);
//     }

//     try {
//       await admin
//         .firestore()
//         .collection("PowerUps")
//         .doc(context.params.userId)
//         .set({
//           [PowerUps.ESCAPE]: { quanity: 1 },
//           [PowerUps.GLORY]: { quanity: 1 },
//           [PowerUps.TRUTH]: { quanity: 1 },
//           [PowerUps.TIME]: { quanity: 1 },
//         });
//     } catch (error) {
//       console.error("Failed to add initial power-ups: ", error);
//     }

//     return null;
//   });

/**
 * onDeviceTokenAdded
 *
 * Subscribes and unsubsribes device tokens to daily trivia topic
 */
export const onDeviceTokenAdded = functions.firestore
  .document("DeviceTokens/{userId}")
  .onWrite(async (snapshot) => {
    const tokensDataBefore = snapshot.before.data();
    const tokensDataAfter = snapshot.after.data();

    const tokensBefore = tokensDataBefore
      ? Object.values(tokensDataBefore)
      : [];
    const tokensAfter = tokensDataAfter ? Object.values(tokensDataAfter) : [];

    const tokensDeleted = arrayDiff<string>(tokensBefore, tokensAfter);
    const tokensAdded = arrayDiff<string>(tokensAfter, tokensBefore);

    if (tokensDeleted.length) {
      console.log("Unsubscribing tokens: ", tokensDeleted);
      try {
        await admin
          .messaging()
          .unsubscribeFromTopic(tokensDeleted, DAILY_TRIVIA_TOPIC);
      } catch (error) {
        console.error("Failed to unsubscribe tokens: ", error);
      }
    }

    if (tokensAdded.length) {
      console.log("Subscribing tokens: ", tokensAdded);
      try {
        await admin
          .messaging()
          .subscribeToTopic(tokensAdded, DAILY_TRIVIA_TOPIC);
      } catch (error) {
        console.error("Failed to subscribe tokens: ", error);
      }
    }

    return null;
  });

export const onActivity = functions.firestore
  .document("Users/{userId}/Activity/{id}")
  .onCreate(async (snapshot, context) => {
    const { userId } = context.params;

    const activity = snapshot.data() as TriviaActivity | undefined;

    if (!activity) {
      return null;
    }

    const { questionId } = activity;

    const session = await getUserTriviaSession(userId);

    try {
      await addQuestionToSession(session, [questionId]);
    } catch (error) {
      console.error(error);
    }

    return null;
  });

export const storeResult = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Login to store game result."
    );
  }

  const { uid } = context.auth;

  const { questionId, category, correct, skipped, doubleRating, hotStreak } =
    data as {
      questionId: string;
      difficulty: number;
      category: TriviaCategory;
      correct: boolean;
      skipped: boolean | null | undefined;
      doubleRating: boolean | null | undefined;
      hotStreak: HotStreakType | null | undefined;
    };

  requireParams({ questionId, category, correct });

  const activityRef = admin
    .firestore()
    .collection("Users")
    .doc(uid)
    .collection("Activity");

  const timestamp = Date.now();

  const ratingsRef = admin.firestore().collection("Ratings").doc(uid);
  const ratingsDoc = await ratingsRef.get();
  const ratings = ratingsDoc.data() as Ratings | null;

  const categoryRating = ratings
    ? ratings.categories?.[category as TriviaCategory] || DEFAULT_RATING
    : DEFAULT_RATING;

  let newRating = categoryRating;

  if (!skipped) {
    let ratingChange = correct ? 10 : -10;
    if (ratingChange > 0) {
      if (doubleRating) {
        ratingChange = ratingChange * 2;
      }
      if (hotStreak) {
        ratingChange =
          ratingChange *
          (hotStreak === "hot"
            ? HOT_STREAK_MULTIPLIER
            : HOTTER_STREAK_MULTIPLIER);
      }
    }
    newRating = Math.max(0, newRating + ratingChange);
    await ratingsRef.set(
      { categoriesUpdated: timestamp, categories: { [category]: newRating } },
      { merge: true }
    );
  }

  const activity: TriviaActivity = {
    questionId,
    category,
    newRating,
    ratingChange: newRating - categoryRating,
    timestamp,
  };

  return activityRef.doc().set(activity);
});

// CRONS

export const updateRanksCronJob = functions
  .runWith({ timeoutSeconds: 540 })
  .pubsub.schedule("0 9 * * *")
  .timeZone("Etc/UTC")
  .onRun(async () => {
    return updateRanks();
  });

export const createDailyTriviaCronJob = functions.pubsub
  .schedule("0 10 * * *")
  .timeZone("Etc/UTC")
  .onRun(async () => {
    return createDailyTrivia();
  });

export const dailyTriviaMessageCronJob = functions.pubsub
  .schedule("0 17 * * *")
  .timeZone("Etc/UTC")
  .onRun(async () => {
    const payload: admin.messaging.MessagingPayload = {
      notification: {
        title: "Conquer the daily trivia",
        body: "Don't miss out on the glory!",
      },
      data: { type: "daily-trivia" },
    };

    return admin.messaging().sendToTopic(DAILY_TRIVIA_TOPIC, payload, {
      collapseKey: "daily-trivia",
      priority: "high",
    });
  });

// writeFakeRatings();

// createServerSession();

// updateRanks();
