import { TriviaCategory } from "./trivia";

export type TriviaApiCategory =
  | "music"
  | "sport_and_leisure"
  | "film_and_tv"
  | "arts_and_literature"
  | "history"
  | "society_and_culture"
  | "science"
  | "geography"
  | "food_and_drink"
  | "general_knowledge";

export type TriviaApiDifficulty = "easy" | "medium" | "hard";

export type TriviaApiQuestionType = "text_choice" | "image_choice";

export type TriviaApiQuestion = {
  category: TriviaApiCategory;
  id: string;
  tags: string[];
  difficulty: TriviaApiDifficulty;
  regions: string[];
  isNiche: boolean;
  question: {
    text: string;
  };
  correctAnswer: string;
  incorrectAnswers: string[];
  type: TriviaApiQuestionType;
};

export type BuildGetQuestionParams = {
  limit?: number;
  categories?: TriviaApiCategory[];
  difficulties?: TriviaApiDifficulty[];
  region?: string;
  tags?: TriviaApiCategory[];
  types?: TriviaApiQuestionType[];
  session?: string;
  preview?: boolean;
};

export type GetQuestionParams = {
  limit?: number; // The number of questions to return. default 10
  categories?: string; // Comma separated list of categories to return questions from. If not provided, all categories will be used.
  difficulties?: string; // Comma separated list of difficulties of questions to return. If not provided, all difficulties will be used.
  region?: string; // Some questions are regional, i.e. only reasonable to ask people from a particular set of countries.
  tags?: string; // Comma separated list of tags to return questions from. If not provided, all tags will be used.
  types?: string; // Comma separated list of the types of questions to return. If not provided, only text choice questions will be used.
  session?: string; // The session id to return questions from. If not provided, questions will not come from a session, so could be duplicates of questions received on previous requests.
  preview?: "true" | "false";
};

export type TriviaSession = {
  categories: TriviaCategory[];
  createdAt: string;
  difficulty: TriviaApiDifficulty[] | null;
  id: string;
  region: string | null;
  remainingQuestions: number;
  tags: TriviaCategory[];
  totalQuestions: number;
  updatedAt: string;
};
