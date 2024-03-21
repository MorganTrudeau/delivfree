import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { OpenAITrivia, TriviaCategory } from "../types";
import {
  capitalize,
  errorHasMessage,
  getRandomCategory,
  getRandomTier,
  shuffle,
} from "./index";
import { Configuration, OpenAIApi } from "openai";
import { categories } from "../data";

const configuration = new Configuration({
  apiKey: functions.config().openai.api_key,
});
const openai = new OpenAIApi(configuration);

const TIER_RATING_RANGE = 1199;

export const aiTierFromRating = (rating: number) => {
  return Math.min(4, Math.max(1, Math.ceil(rating / TIER_RATING_RANGE)));
};

const getDifficultyPrompt = (tier: number, category: TriviaCategory) => {
  const schoolCategories: TriviaCategory[] = [
    "science",
    "history",
    "geography",
    "arts_and_literature",
  ];

  if (schoolCategories.includes(category)) {
    if (tier >= 4) {
      return "suitable for a PhD student";
    } else if (tier === 3) {
      return "suitable for a college student";
    } else if (tier === 2) {
      return "suitable for a high school student";
    } else {
      return "suitable for an elementary school student";
    }
  } else {
    if (tier >= 4) {
      return "suitable for someone with expert knowledge of the topic";
    } else if (tier === 3) {
      return "suitable for someone with intermediate knowledge of the subject";
    } else if (tier === 2) {
      return "suitable for someone with an average knowledge of the subject";
    } else {
      return "suitable for someone with below average knowledge of the subject";
    }
  }
};

const getCategoryPrompt = (tier: number, category: TriviaCategory) => {
  return category;
  //   const subcategory = getRandomSubcategory(category);

  //   return `${subcategory} (${category})`;
};

const getIgnoreTopicsPrompt = (ignoreTopics: string[]) =>
  ignoreTopics.length
    ? `Do not base question on the following topics: ${ignoreTopics.join(
        ", "
      )}. `
    : "";

const cleanText = (text: string | undefined): string | undefined => {
  if (
    typeof text !== "string" ||
    text.length === 0 ||
    !text.includes("]") ||
    !text.includes("[")
  ) {
    return text;
  }
  const replacedText = text.replace(',"', '",');
  const arrayStart = replacedText.indexOf("[");
  const arrayEnd = replacedText.lastIndexOf("]");
  return replacedText.substring(arrayStart, arrayEnd + 1);
};

export const generateTriviaQuestion = async ({
  tier,
  category,
  retries = 0,
  ignoreTopics = [],
}: {
  tier?: number;
  category?: TriviaCategory;
  retries?: number;
  ignoreTopics?: string[];
}): Promise<OpenAITrivia> => {
  const _category = category ?? getRandomCategory();
  const _tier = tier ?? getRandomTier();

  let generatedQuestion: Omit<OpenAITrivia, "id"> | undefined; // Used when retrying when question is duplicate

  try {
    const res = await openai.createCompletion({
      presence_penalty: 2,
      max_tokens: 4097 - 500,
      model: "text-davinci-003",
      prompt: `Using only sited and proven facts, generate a ${getCategoryPrompt(
        _tier,
        _category
      )} category trivia question ${getDifficultyPrompt(
        _tier,
        _category
      )}. ${getIgnoreTopicsPrompt(
        ignoreTopics
      )}Choose a question that has exactly one correct answer. Do not choose questions based on popularity. Only choose a question if the answer cannot change in the future. Format your response as an array in this order: [question, correct_answer, wrong_answer, wrong_answer, wrong_answer]`,
    });

    const { data } = res;

    if (!data) {
      throw new Error("missing data");
    }

    const TriviaCollection = admin.firestore().collection("TriviaQuestions");

    const { choices } = data;

    const triviaText = choices[0]?.text
      ? cleanText(choices[0].text)
      : undefined;

    if (!(triviaText && typeof triviaText === "string")) {
      throw new Error("choices text not string");
    }

    const triviaArray = parseTriviaArray(triviaText);

    const question = triviaArray.shift()?.trim() as string;

    const correctAnswer = capitalize(triviaArray[0]).trim();
    const answers = shuffle(triviaArray).map((answer) =>
      capitalize(answer).trim()
    );

    generatedQuestion = {
      question,
      correctAnswer,
      answers,
      tier: _tier,
      category: _category,
      timestamp: Date.now(),
      approved: false,
    };

    validateQuestionStructure(generatedQuestion);

    validateAnswerNotInQuestion(generatedQuestion);

    await validateQuestionNotDuplicate(generatedQuestion);

    const docId = TriviaCollection.doc().id;

    await TriviaCollection.doc(docId).set(generatedQuestion);

    console.log(
      `Generated question\n${docId}\n${question}\n${correctAnswer}\n`
    );

    return { ...generatedQuestion, id: docId };
  } catch (error) {
    // @ts-ignore
    if (error?.response?.data) {
      // @ts-ignore
      console.error(error?.response?.data);
    }
    console.error(errorHasMessage(error) ? error.message : error);
    if (generatedQuestion) {
      console.error(
        `Error in question\n${generatedQuestion.question}\n${generatedQuestion.correctAnswer}\n`
      );
    } else {
      console.error("No question generated");
    }

    if (retries < 3) {
      return generateTriviaQuestion({
        tier,
        category,
        retries: retries + 1,
        ignoreTopics: generatedQuestion?.correctAnswer
          ? [...ignoreTopics, generatedQuestion.correctAnswer]
          : ignoreTopics,
      });
    } else {
      throw new Error("Unable to generate question");
    }
  }
};

export const generateTriviaExplanation = async (
  trivia: Pick<OpenAITrivia, "question" | "correctAnswer">
) => {
  const res = await openai.createCompletion({
    presence_penalty: 2,
    max_tokens: 4097 - 200,
    model: "text-davinci-003",
    prompt: `Use a 3 to 4 sentence paragraph to describe the following trivia question.###Question: ${trivia.question}\nCorrect Answer: ${trivia.correctAnswer}###`,
  });
  return res.data.choices[0].text?.trim() as string | undefined;
};

export const assignTriviaCategory = async (trivia: OpenAITrivia) => {
  const res = await openai.createCompletion({
    presence_penalty: 2,
    max_tokens: 4097 - 200,
    model: "text-davinci-003",
    prompt: `Out of the following categories, ${categories.join(
      ", "
    )}, how would you classify this question:\n${trivia.question}`,
  });
  return res.data.choices[0].text?.trim();
};

export const selectTrivia = async (
  n: number,
  queryParams: {
    generateMissingTrivia?: boolean;
    userId: string;
    rating: number;
    category: TriviaCategory;
  },
  docs: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>[] = []
): Promise<OpenAITrivia[]> => {
  const collection = admin.firestore().collection("TriviaQuestions");

  const { generateMissingTrivia, userId, rating, category } = queryParams;
  const tier = aiTierFromRating(rating);
  const documentId = admin.firestore.FieldPath.documentId();

  let query = collection
    .where("category", "==", category)
    .where("tier", "==", tier)
    .where("approved", "==", true);

  const completedQuestionsSnapshot = await admin
    .firestore()
    .collection("Users")
    .doc(userId)
    .collection("Completion")
    .doc(category)
    .get();

  const tierString = tier.toString();

  const completedQuestionData = completedQuestionsSnapshot.data();
  const completedCorrectIds =
    completedQuestionData?.[tierString]?.correctIds ?? [];
  const completedIncorrectIds =
    completedQuestionData?.[tierString]?.incorrectIds ?? [];
  const completedQuestionIds: string[] = [
    ...completedCorrectIds,
    ...completedIncorrectIds,
  ];

  if (completedQuestionIds && completedQuestionIds.length > 0) {
    console.log(
      `Ignoring ${completedQuestionIds.length} questions: `,
      completedQuestionIds
    );
    query = query.where(documentId, "not-in", completedQuestionIds.slice(-10));
  }

  const triviaDocs = [...docs];
  let limit = n - triviaDocs.length;

  const formatReponseDocData = (
    docs: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>[]
  ) => {
    return docs.map((doc) => ({ ...doc.data(), id: doc.id } as OpenAITrivia));
  };

  const addResponseDocs = (
    _docs: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>[]
  ) => {
    if (completedQuestionIds.length) {
      const filteredDocs = _docs.filter(
        (d) => !completedQuestionIds.includes(d.id)
      );
      triviaDocs.push(...filteredDocs);
    } else {
      triviaDocs.push(..._docs);
    }
    limit = n - triviaDocs.length;
  };

  const randomDocId = collection.doc().id;

  const lower = await query
    .orderBy(documentId, "desc")
    .where(documentId, "<=", randomDocId)
    .limit(limit)
    .get();

  console.log("lower size", lower.size);

  addResponseDocs(lower.docs);

  console.log("triviaDocs size", triviaDocs.length);

  if (limit === 0) {
    return formatReponseDocData(triviaDocs);
  }

  const upper = await query
    .orderBy(documentId)
    .where(documentId, ">", randomDocId)
    .limit(limit)
    .get();

  console.log("upper size", upper.size);

  addResponseDocs(upper.docs);

  console.log("triviaDocs size", triviaDocs.length);

  if (generateMissingTrivia && limit !== 0) {
    console.log(`Generating ${limit} new questions`);
    const generatedTriviaQuestions = await Promise.all(
      new Array(limit)
        .fill(0)
        .map(() => generateTriviaQuestion({ tier, category }))
    );
    return [...generatedTriviaQuestions, ...formatReponseDocData(triviaDocs)];
  } else {
    return formatReponseDocData(triviaDocs);
  }
};

export const validateQuestion = async (question: OpenAITrivia) => {
  const res = await openai.createCompletion({
    // presence_penalty: 2,
    max_tokens: 4097 - 200,
    model: "text-davinci-003",
    prompt: `Respond with one word: yes or no###Is the following trivia question factually correct and could not have any other possible correct answer?\n\nQuestion: ${question.question}\nCorrect Answer: ${question.correctAnswer}`,
  });

  const answer = res.data.choices[0].text?.trim()?.toLowerCase();
  return answer?.includes("yes");
};

const validateAnswerNotInQuestion = (trivia: Omit<OpenAITrivia, "id">) => {
  if (
    trivia.question.toLowerCase().includes(trivia.correctAnswer.toLowerCase())
  ) {
    throw new Error("answer inside question");
  }
};

const validateQuestionNotDuplicate = async (
  trivia: Omit<OpenAITrivia, "id">
) => {
  const duplicateQuestion = await admin
    .firestore()
    .collection("TriviaQuestions")
    .where("category", "==", trivia.category)
    .where("correctAnswer", "==", trivia.correctAnswer)
    .limit(1)
    .get();

  if (!duplicateQuestion.empty) {
    throw new Error("question is duplicate");
  }
};

const validateQuestionStructure = (trivia: Omit<OpenAITrivia, "id">) => {
  const valid =
    trivia.question &&
    typeof trivia.question === "string" &&
    trivia.correctAnswer &&
    typeof trivia.correctAnswer === "string" &&
    Array.isArray(trivia.answers);
  if (!valid) {
    throw new Error("invalid question structure");
  }
};

const parseTriviaArray = (text: string): string[] => {
  try {
    const parsedTriviaArray = JSON.parse(text.trim()) as string[] | string;

    if (!Array.isArray(parsedTriviaArray)) {
      throw new Error("invalid-data");
    }

    return parsedTriviaArray;
  } catch (error) {
    console.error("trivia text\n", text);
    throw new Error("trivia not array");
  }
};
