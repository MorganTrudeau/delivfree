import { GameTypes, PowerUps, TriviaCategories } from "./enums";
import { BadgeId, User } from "./index";

export type GameType = (typeof GameTypes)[keyof typeof GameTypes];

export type TriviaCategory =
  (typeof TriviaCategories)[keyof typeof TriviaCategories];
// | "music"
// | "sport_and_leisure"
// | "film_and_tv"
// | "arts_and_literature"
// | "history"
// | "society_and_culture"
// | "science"
// | "geography"
// | "food_and_drink"
// | "general_knowledge";

export type Trivia = {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  difficulty: TriviaDifficulty;
  category: TriviaCategory;
  explanation?: string;
};

export type TriviaDifficulty = "easy" | "medium" | "hard";

export type OpenAITrivia = {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
  tier: number;
  category: TriviaCategory;
  explanation?: string;
  timestamp: number;
  approved: boolean;
};

export type TriviaResults = {
  question: string;
  answer: string | null;
  skipped?: boolean | null;
  correctAnswer: string;
};

export type Ratings = {
  categories?: { [Proptery in TriviaCategory]?: number } & { overall?: number };
  changes?: { [Proptery in TriviaCategory]?: number } & { overall?: number };
  ranks?: { [Proptery in TriviaCategory]?: number } & { overall?: number };
  ranksUpdated?: number;
  categoriesUpdated?: number;
};

export type UserRatings = { user: User; userId: string; ratings: Ratings };

export type ChallengeResults = {
  [questionId: string]: {
    correct: boolean;
    answer: string | null;
    skipped: boolean | null;
  };
};
export type Challenge = {
  timestamp: number;
  id: string;
  challenger: string;
  opponent: string;
  users: string[];
  trivia: { [userId: string]: Trivia[] };
  results?: {
    [userId: string]: ChallengeResults;
  };
  accepted: boolean;
};

export type PowerUp = (typeof PowerUps)[keyof typeof PowerUps];

export type DailyTrivia = {
  ids: string[];
  date: string;
};

export type DailyTriviaResults = {
  results: {
    [questionId: string]: {
      correct: boolean;
      answer: string | null;
      skipped: boolean | null;
    };
  };
};

export type DailyTriviaStats = {
  lastDateCompleted?: string;
  streak?: number;
};

export type NextBadgeCutOff = {
  badge: BadgeId;
  previousRating: number;
  nextRating: number;
  currentRating: number;
  progress: number;
};

export type HotStreakType = "hot" | "hotter";

export type TriviaActivity = {
  questionId: string;
  category: TriviaCategory;
  newRating: number;
  ratingChange: number;
  timestamp: number;
};
