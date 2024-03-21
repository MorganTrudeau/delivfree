export const GameTypes = {
  CASUAL: "casual",
  RANKED: "ranked",
  VERSUS: "versus",
  DAILY: "daily",
  CHALLENGE: "challenge",
} as const;

export const AppMessageTypes = {
  CHALLENGE_CREATE: "challenge-create",
  CHALLENGE_ACCEPT: "challenge-accept",
  CHALLENGE_UPDATE: "challenge-update",
  DAILY_TRIVIA: "daily-trivia",
} as const;

export const PowerUps = {
  GLORY: "glory",
  TIME: "time",
  TRUTH: "truth",
  ESCAPE: "escape",
} as const;

export const Sizes = {
  XXS: "xxs",
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
  XXL: "xxl",
} as const;

export const TriviaCategories = {
  GENERAL: "general_knowledge",
  HISTORY: "history",
  GEOGRAPHY: "geography",
  SCIENCE: "science",
  SPORTS: "sport_and_leisure",
  MUSIC: "music",
  MOVIES: "film_and_tv",
  ARTS: "arts_and_literature",
  FOOD: "food_and_drink",
  SOCIETY: "society_and_culture",
} as const;

export const BadgeIds = {
  // Rating badges
  SCOUT: "scout",
  PRIVATE: "private",
  RIVAL: "rival",
  CHALLENGER: "challenger",
  GLADIATOR: "gladiator",
  // Category rating badges
  GENERAL_NOVICE: "generalNovice",
  GENERAL_VETERAN: "generalVeteran",
  GENERAL_CHAMPION: "generalChampion",
  SPORTS_NOVICE: "sportsNovice",
  SPORTS_VETERAN: "sportsVeteran",
  SPORTS_CHAMPION: "sportsChampion",
  ARTS_NOVICE: "artsNovice",
  ARTS_VETERAN: "artsVeteran",
  ARTS_CHAMPION: "artsChampion",
  MOVIES_NOVICE: "moviesNovice",
  MOVIES_VETERAN: "moviesVeteran",
  MOVIES_CHAMPION: "movieChampion",
  SCIENCE_NOVICE: "scienceNovice",
  SCIENCE_VETERAN: "scienceVeteran",
  SCIENCE_CHAMPION: "scienceChampion",
  MUSIC_NOVICE: "musicNovice",
  MUSIC_VETERAN: "musicVeteran",
  MUSIC_CHAMPION: "musicChampion",
  GEOGRAPHY_NOVICE: "geographyNovice",
  GEOGRAPHY_VETERAN: "geographyVeteran",
  GEOGRAPHY_CHAMPION: "geographyChampion",
  FOOD_NOVICE: "foodNovice",
  FOOD_VETERAN: "foodVeteran",
  FOOD_CHAMPION: "foodChampion",
  SOCIETY_NOVICE: "societyNovice",
  SOCIETY_VETERAN: "societyVeteran",
  SOCIETY_CHAMPION: "societyChampion",
  HISTORY_NOVICE: "historyNovice",
  HISTORY_VETERAN: "historyVeteran",
  HISTORY_CHAMPION: "historyChampion",
  TRIVIA_MASTER: "triviaMaster",
  // Ranks badges
  RANK_THREE: "rankThree",
  RANK_TWO: "rankTwo",
  RANK_ONE: "rankOne",
  // Event badges
  VICTORIOUS: "victorious",
  IRON_MAN: "ironMan",
  // REVIEWER: "reviewer",
  RECRUITER: "recruiter",
  MONEY_BAGS: "moneyBags",
  // Badges complete
  SMARTICUS: "smarticus",
} as const;
