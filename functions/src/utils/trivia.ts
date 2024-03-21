import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  NOVICE_RATING,
  Ratings,
  Trivia,
  TriviaCategories,
  TriviaCategory,
  VETERAN_RATING,
} from "../types";
import { capitalize, errorHasMessage, formatDate, shuffle } from "./index";
import { categories } from "../data";
import axios from "axios";
import {
  BuildGetQuestionParams,
  GetQuestionParams,
  TriviaApiCategory,
  TriviaApiDifficulty,
  TriviaApiQuestion,
} from "../types/triviaApi";
import { getBadgesForRatings } from "./badges";

export const getTriviaCategoryName = (
  category: TriviaCategory | "overall"
): string => {
  switch (category) {
    case "overall":
      return "Overall";
    case TriviaCategories.ARTS:
      return "Arts & Literature";
    case TriviaCategories.MOVIES:
      return "Movies & TV";
    case TriviaCategories.FOOD:
      return "Food & Drink";
    case TriviaCategories.GENERAL:
      return "General";
    case TriviaCategories.GEOGRAPHY:
      return "Geography";
    case TriviaCategories.HISTORY:
      return "History";
    case TriviaCategories.MUSIC:
      return "Music";
    case TriviaCategories.SCIENCE:
      return "Science";
    case TriviaCategories.SOCIETY:
      return "Society";
    case TriviaCategories.SPORTS:
      return "Sports & Leisure";
  }
};

const axiosInstance = axios.create({
  baseURL: "https://the-trivia-api.com/v2/",
  timeout: 5000,
  headers: {
    "X-API-Key": functions.config().trivia_api.api_key,
    "Content-Type": "application/json",
  },
});

const triviaRequest = async (
  endpoint: string,
  method: "GET" | "POST",
  params?: { [key: string]: string | number | string[] },
  data?: string
) => {
  const res = await axiosInstance.request({
    url: endpoint,
    method,
    params,
    data,
  });
  return res.data;
};

export const createSession = async () => {
  return triviaRequest("session", "POST");
};

export const getSession = async (id: string) => {
  return triviaRequest(`session/${id}`, "GET");
};

export const createUserSession = async (userId: string) => {
  const newSession = await createSession();
  const sessionId = newSession.id;
  await admin
    .firestore()
    .collection("Users")
    .doc(userId)
    .update({ session: sessionId });
  return sessionId as string;
};

export const addQuestionToSession = (
  sessionId: string,
  questionIds: string[]
) => {
  return triviaRequest(
    `session/${sessionId}/questions`,
    "POST",
    undefined,
    JSON.stringify({ questionIds })
  );
};

export const getUserTriviaSession = async (userId: string) => {
  const userDoc = await admin.firestore().collection("Users").doc(userId).get();
  const user = userDoc.data();
  if (user && user.session) {
    console.log("Using session: ", user.session);
    return user.session;
  } else {
    const session = await createUserSession(userId);
    return session;
  }
};

export const getQuestion = async (id: string) => {
  const triviaRes: TriviaApiQuestion = await triviaRequest(
    `question/${id}`,
    "GET"
  );
  return buildTriviaModel(triviaRes);
};

export const getUserTrivia = async (
  userId: string,
  params: {
    limit: number;
    difficulties?: TriviaApiDifficulty[];
    categories?: TriviaApiCategory[];
    preview: boolean;
  }
) => {
  const session = await getUserTriviaSession(userId);

  const trivia = await getTrivia({ ...params, session });

  if (trivia.length < params.limit) {
    const newSession = await createUserSession(userId);
    return getTrivia({ ...params, session: newSession });
  }

  return trivia;
};

export const getTrivia = async (
  params: {
    limit: number;
    difficulties?: TriviaApiDifficulty[];
    session?: string;
    categories?: TriviaApiCategory[];
    preview: boolean;
  },
  retries = 0
): Promise<Trivia[]> => {
  const { difficulties, categories, session, limit = 1, preview } = params;
  try {
    const params: GetQuestionParams = buildGetTriviaRequestParams({
      limit,
      categories,
      difficulties,
      session,
      preview,
    });
    const triviaRes: TriviaApiQuestion[] = await triviaRequest(
      "questions",
      "GET",
      params
    );

    return mapTriviaResponse(triviaRes);
  } catch (error) {
    console.error(errorHasMessage(error) ? error.message : error);

    if (retries < 3) {
      return getTrivia(params, retries + 1);
    } else {
      throw new Error("Unable to generate question");
    }
  }
};

export const updateRanks = async () => {
  const ratingsCollection = admin.firestore().collection("Ratings");
  const ratingsSnapshot = await ratingsCollection.get();

  const ratings = ratingsSnapshot.docs.map((doc) => ({
    ...(doc.data() as Ratings),
    id: doc.id,
  })) as (Ratings & { id: string })[];

  const ratingsSortedByCategory = ["overall" as const, ...categories].reduce(
    (acc, category) => {
      const categoryRatings = ratings
        .filter((r) => r.categories?.[category])
        .sort((a, b) => {
          const ratingA = a.categories?.[category];
          const ratingB = b.categories?.[category];

          if (!ratingA) {
            return 1;
          }

          if (!ratingB) {
            return -1;
          }

          return ratingB - ratingA;
        });

      return { ...acc, [category]: categoryRatings };
    },
    {} as { [Property in TriviaCategory]: (Ratings & { id: string })[] }
  );

  const writes: Promise<admin.firestore.WriteResult>[] = [];

  const ranks: {
    [docId: string]: { [Property in TriviaCategory]?: number };
  } = {};

  Object.entries(ratingsSortedByCategory).forEach(([category, ratings]) => {
    let rank = 1;

    for (let i = 0; i < ratings.length; i++) {
      const rating = ratings[i];

      const categoryRating = rating.categories?.[category as TriviaCategory];

      if (!categoryRating) {
        break;
      }

      ranks[rating.id] = ranks[rating.id] || {};
      ranks[rating.id][category as TriviaCategory] = rank;

      rank++;
    }
  });

  Object.entries(ranks).forEach(([docId, ranks]) => {
    writes.push(
      ratingsCollection
        .doc(docId)
        .set({ ranksUpdated: Date.now(), ranks }, { merge: true })
    );
  });

  return Promise.all(writes);
};

export const createDailyTrivia = async () => {
  const limit = 5;
  const date = formatDate(new Date());

  const dailyTriviaRef = admin.firestore().collection("DailyTrivia").doc(date);

  const serverConfigRef = admin.firestore().collection("Admin").doc("server");
  const serverConfig = await serverConfigRef.get();
  const serverSession = (serverConfig.data() as { session: string }).session;

  const trivia = await getTrivia({
    limit,
    session: serverSession,
    preview: false,
  });

  if (trivia.length === limit) {
    const triviaIds = trivia.map((t) => t.id);
    return dailyTriviaRef.set({ date, ids: triviaIds });
  } else {
    await admin
      .firestore()
      .collection("Admin")
      .doc("server")
      .update({
        serverSessionsCompleted: admin.firestore.FieldValue.increment(1),
      });
    const newSession = await createSession();
    const newSessionId = newSession.id;
    await serverConfigRef.update({ session: newSessionId });
    const trivia = await getTrivia({
      limit,
      session: newSessionId,
      preview: false,
    });
    const triviaIds = trivia.map((t) => t.id);
    return dailyTriviaRef.set({ date, ids: triviaIds });
  }
};

/**
 * HELPER FUNCTIONS
 */

const buildGetTriviaRequestParams = (
  buildParams: BuildGetQuestionParams
): GetQuestionParams => {
  const getParams: GetQuestionParams = {};

  if (buildParams.limit) {
    getParams.limit = buildParams.limit;
  }

  if (buildParams.categories) {
    getParams.categories = buildParams.categories.join(",");
  }

  if (buildParams.difficulties) {
    getParams.difficulties = buildParams.difficulties.join(",");
  }

  if (buildParams.region) {
    getParams.region = buildParams.region;
  }

  if (buildParams.session) {
    getParams.session = buildParams.session;
  }

  if (buildParams.tags) {
    getParams.tags = buildParams.tags.join(",");
  }

  if (buildParams.types) {
    getParams.types = buildParams.types.join(",");
  }

  if (buildParams.preview) {
    getParams.preview = buildParams.preview ? "true" : "false";
  }

  return getParams;
};

const triviaDifficultyFromRating = (rating: number): TriviaApiDifficulty[] => {
  if (rating >= VETERAN_RATING) {
    return ["easy", "medium", "hard"];
  } else if (rating >= NOVICE_RATING) {
    return ["easy", "medium"];
  } else {
    return ["easy"];
  }
};

export const getDifficultyFromRating = (rating: number) => {
  return triviaDifficultyFromRating(rating);
};

export const buildTriviaModel = (trivia: TriviaApiQuestion): Trivia => {
  const question = trivia.question.text;

  const correctAnswer = trivia.correctAnswer;
  const answers = shuffle([correctAnswer, ...trivia.incorrectAnswers]);
  const category = trivia.category;

  return {
    question,
    correctAnswer: capitalize(correctAnswer),
    answers: answers.map((a) => capitalize(a)),
    category,
    difficulty: trivia.difficulty,
    id: trivia.id,
  };
};

export const mapTriviaResponse = (triviaRes: TriviaApiQuestion[]): Trivia[] =>
  triviaRes.map((trivia) => {
    return buildTriviaModel(trivia);
  });

export const getLatestDailyTriviaDate = () => {
  const date = new Date();

  if (date.getHours() < 10) {
    date.setDate(date.getDate() - 1);
  }

  return date;
};

export const createServerSession = async () => {
  const session = await createSession();
  return admin
    .firestore()
    .collection("Admin")
    .doc("server")
    .set({ session: session.id });
};

export const writeFakeRatings = async () => {
  try {
    const userSnap = await admin.firestore().collection("Users").get();

    await Promise.all(
      userSnap.docs.map((doc) => {
        const userId = doc.id;

        if (
          !doc.data().avatar ||
          [
            "xmichM9woVee2KDlx8Y3jaUmPYB2",
            "mlXdw7IHGcNzHjSLxfG63dAA7Ih2",
            "0OOkChT4ifZj0SRaUoJAAk7JX9o2",
          ].includes(userId)
        ) {
          return;
        }

        const ratingsRef = admin.firestore().collection("Ratings").doc(userId);
        const badgesRef = admin
          .firestore()
          .collection("Users")
          .doc(userId)
          .collection("Badges");
        const batch = admin.firestore().batch();

        const categoryRatings: { [key: string]: number } = {};

        categories.map((category) => {
          const rating = Math.floor(1700 + 800 * Math.random());

          categoryRatings[category] = rating;

          return batch.set(
            ratingsRef,
            {
              categories: {
                [category]: rating,
              },
            },
            { merge: true }
          );
        });

        const overall = Object.values(categoryRatings).reduce(
          (acc, rating) => acc + rating,
          0
        );

        categoryRatings.overall = overall;

        const badges = getBadgesForRatings(categoryRatings);

        badges.forEach((badge) =>
          batch.set(badgesRef.doc(badge), {
            badgeId: badge,
            achieved: true,
            collected: true,
            achievedTimestamp: Date.now(),
            collectedTimestamp: Date.now(),
            acknowledged: true,
          })
        );

        batch.set(
          ratingsRef,
          { categoriesUpdated: Date.now() },
          { merge: true }
        );

        return batch.commit();
      })
    );

    console.log("SUCCESS");
  } catch (error) {
    console.error(error);
  }
};
