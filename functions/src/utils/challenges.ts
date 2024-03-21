import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {
  buildMessagePayload,
  getDeviceTokens,
  removeRandomValue,
} from "./index";
import { getDifficultyFromRating, getUserTrivia } from "./trivia";
import { categories } from "../data";
import { DEFAULT_RATING, User } from "../types/index";

export const createChallenge = async ({
  challenger,
  opponent,
}: {
  challenger: string;
  opponent: string;
}) => {
  const ratingsCollection = admin.firestore().collection("Ratings");

  const challengerRatingsDoc = await ratingsCollection.doc(challenger).get();
  const challengerRatings = challengerRatingsDoc.data();

  const categoriesCopy = [...categories];

  const challengerCategories = new Array(5)
    .fill(0)
    .map(() => removeRandomValue(categoriesCopy));

  const challengerTrivia = await Promise.all(
    challengerCategories.map(async (category) => {
      const rating =
        challengerRatings && challengerRatings[category]
          ? challengerRatings[category]
          : DEFAULT_RATING;

      const questions = await getUserTrivia(challenger, {
        difficulties: getDifficultyFromRating(rating),
        preview: true,
        limit: 1,
      });

      const question = questions[0];
      if (!question) {
        throw new functions.https.HttpsError(
          "internal",
          "Failed to generate question"
        );
      }
      return questions[0];
    })
  );

  const opponentCategories = new Array(5)
    .fill(0)
    .map(() => removeRandomValue(categoriesCopy));

  const opponentRatingsDoc = await ratingsCollection.doc(opponent).get();
  const opponentRatings = opponentRatingsDoc.data();

  const opponentTrivia = await Promise.all(
    opponentCategories.map(async (category) => {
      const rating =
        opponentRatings && opponentRatings[category]
          ? opponentRatings[category]
          : DEFAULT_RATING;

      const questions = await getUserTrivia(opponent, {
        difficulties: getDifficultyFromRating(rating),
        preview: true,
        limit: 1,
      });

      const question = questions[0];
      if (!question) {
        throw new functions.https.HttpsError(
          "internal",
          "Failed to generate question"
        );
      }
      return questions[0];
    })
  );

  const challengeCollection = admin.firestore().collection("Challenges");
  const challengeId = challengeCollection.doc().id;

  const challengeGame = {
    timestamp: Date.now(),
    accepted: false,
    challenger,
    opponent,
    users: [challenger, opponent],
    trivia: { [opponent]: opponentTrivia, [challenger]: challengerTrivia },
  };

  await challengeCollection.doc(challengeId).set(challengeGame);

  return { ...challengeGame, id: challengeId };
};

export const notifyChallengeAccepted = async (
  challengeId: string,
  challenger: string
) => {
  const deviceTokens = await getDeviceTokens([challenger]);

  if (deviceTokens) {
    const payload = buildMessagePayload(
      {
        title: "Enter the arena",
        body: "Your opponent has accepted your challenge!",
      },
      { challengeId, type: "challenge-accept" },
      "challenge-accept"
    );

    const messages: admin.messaging.Message[] = deviceTokens.map((token) => ({
      token,
      ...payload,
    }));

    await admin.messaging().sendAll(messages);
  }
};

export const notifyChallengeCreated = async (
  challengeId: string,
  opponent: string
) => {
  const deviceTokens = await getDeviceTokens([opponent]);

  if (deviceTokens.length) {
    const payload = buildMessagePayload(
      {
        title: "Enter the arena",
        body: "Let's see who is the real SMARTICUS!",
      },
      { challengeId, type: "challenge-create" },
      "challenge-create"
    );

    const messages: admin.messaging.Message[] = deviceTokens.map((token) => ({
      token,
      ...payload,
    }));

    console.log("Send challenge created notification", deviceTokens);

    await admin.messaging().sendAll(messages);
  } else {
    console.error(
      "Failed to send challenge create notification - no device tokens"
    );
  }
};

export const notifyStartChallengeFailed = async (challenger: string) => {
  const deviceTokens = await getDeviceTokens([challenger]);

  if (deviceTokens.length) {
    const payload = buildMessagePayload(
      {
        title: "Challenge not created",
        body: "There was a problem sending your challenge. Please try again.",
      },
      {},
      "challenge-failed"
    );

    const messages: admin.messaging.Message[] = deviceTokens.map((token) => ({
      token,
      ...payload,
    }));

    await admin.messaging().sendAll(messages);
  }
};

export const notifyStartChallengeDeclined = async (
  challenger: string,
  opponent: string
) => {
  const deviceTokens = await getDeviceTokens([challenger]);

  if (deviceTokens.length) {
    const userDoc = await admin
      .firestore()
      .collection("Users")
      .doc(opponent)
      .get();
    const user = userDoc.data() as User | undefined;

    if (!user) {
      return;
    }

    const payload = buildMessagePayload(
      {
        title: "Challenge declined",
        body: `${user.username} declined your challenge.`,
      },
      {},
      "challenge-declined"
    );

    const messages: admin.messaging.Message[] = deviceTokens.map((token) => ({
      token,
      ...payload,
    }));

    await admin.messaging().sendAll(messages);
  }
};

export const notifyFinishedSelfQuestions = async (
  challengeId: string,
  userId: string
) => {
  const deviceTokens = await getDeviceTokens([userId]);

  if (deviceTokens) {
    const payload = buildMessagePayload(
      {
        title: "Back to your challenge",
        body: "Your opponent has finished their questions. See if you can steal!",
      },
      { challengeId, type: "challenge-update" },
      `challenge-update-${challengeId}`
    );

    const messages: admin.messaging.Message[] = deviceTokens.map((token) => ({
      token,
      ...payload,
    }));

    await admin.messaging().sendAll(messages);
  }
};

export const notifyFinishedSteal = async (
  challengeId: string,
  userId: string
) => {
  const deviceTokens = await getDeviceTokens([userId]);

  if (deviceTokens) {
    const payload = buildMessagePayload(
      {
        title: "Back to your challenge",
        body: "Your opponent is done stealing. See how they did!",
      },
      { challengeId, type: "challenge-update" },
      `challenge-update-${challengeId}`
    );

    const messages: admin.messaging.Message[] = deviceTokens.map((token) => ({
      token,
      ...payload,
    }));

    await admin.messaging().sendAll(messages);
  }
};
