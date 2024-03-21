import Scout from "../../assets/svg/badges/011-medal.svg";
import Private from "../../assets/svg/badges/003-medal.svg";
import Rival from "../../assets/svg/badges/001-medal.svg";
import Challenger from "../../assets/svg/badges/016-medal.svg";
import Gladiator from "../../assets/svg/badges/036-medal.svg";
import SportsNovice from "../../assets/svg/badges/sports-level-1.svg";
import SportsVeteran from "../../assets/svg/badges/sports-level-2.svg";
import SportsChampion from "../../assets/svg/badges/026-trophy.svg";
import MoviesNovice from "../../assets/svg/badges/movies-level-1.svg";
import MoviesVeteran from "../../assets/svg/badges/movies-level-2.svg";
import MoviesChampion from "../../assets/svg/badges/022-trophy.svg";
import MusicNovice from "../../assets/svg/badges/music-level-1.svg";
import MusicVeteran from "../../assets/svg/badges/music-level-2.svg";
import MusicChampion from "../../assets/svg/badges/044-award.svg";
import ScienceNovice from "../../assets/svg/badges/science-level-1.svg";
import ScienceVeteran from "../../assets/svg/badges/science-level-2.svg";
import ScienceChampion from "../../assets/svg/badges/018-trophy.svg";
import GeneralNovice from "../../assets/svg/badges/general-level-1.svg";
import GeneralVeteran from "../../assets/svg/badges/general-level-2.svg";
import GeneralChampion from "../../assets/svg/badges/013-trophy.svg";
import ArtsNovice from "../../assets/svg/badges/art-level-1.svg";
import ArtsVeteran from "../../assets/svg/badges/art-level-2.svg";
import ArtsChampion from "../../assets/svg/badges/055-award.svg";
import FoodNovice from "../../assets/svg/badges/food-level-1.svg";
import FoodVeteran from "../../assets/svg/badges/food-level-2.svg";
import FoodChampion from "../../assets/svg/badges/051-trophy.svg";
import GeographyNovice from "../../assets/svg/badges/geography-level-1.svg";
import GeographyVeteran from "../../assets/svg/badges/geography-level-2.svg";
import GeographyChampion from "../../assets/svg/badges/052-trophy.svg";
import SocietyNovice from "../../assets/svg/badges/society-level-1.svg";
import SocietyVeteran from "../../assets/svg/badges/society-level-2.svg";
import SocietyChampion from "../../assets/svg/badges/053-trophy.svg";
import HistoryNovice from "../../assets/svg/badges/history-level-1.svg";
import HistoryVeteran from "../../assets/svg/badges/history-level-2.svg";
import HistoryChampion from "../../assets/svg/badges/054-trophy.svg";
import TriviaMaster from "../../assets/svg/badges/014-trophy.svg";
import Smarticus from "../../assets/svg/badges/027-crown.svg";
import Recruiter from "../../assets/svg/badges/039-medal.svg";
import Victorious from "../../assets/svg/badges/031-podium.svg";
import MoneyBags from "../../assets/svg/badges/046-moneybag.svg";
import IronMan from "../../assets/svg/badges/034-flag.svg";
import RankOne from "../../assets/svg/badges/002-gold-medal.svg";
import RankTwo from "../../assets/svg/badges/004-silver-medal.svg";
import RankThree from "../../assets/svg/badges/007-bronze-medal.svg";
import {
  Badge,
  BadgeId,
  BadgeIds,
  CHALLENGER_RATING,
  GLADIATOR_RATING,
  CHAMPION_RATING,
  COINS_ACHEIVEMENT,
  RIVAL_RATING,
  SCOUT_RATING,
  TriviaCategories,
  TriviaCategory,
  PRIVATE_RATING,
  DAILY_TRIVIA_STREAK_ACHIEVEMENT,
  Ratings,
  UserBadge,
  DEFAULT_RATING,
  NextBadgeCutOff,
  NOVICE_RATING,
  VETERAN_RATING,
  BADGE_COST_XS,
  BADGE_COST_SM,
  BADGE_COST_MD,
  BADGE_COST_LG,
  BADGE_COST_XL,
  BADGE_COST_XXL,
} from "smarticus";
import Share from "react-native-share";

export const getNoviceBadgeForCategory = (category: TriviaCategory) => {
  switch (category) {
    case TriviaCategories.ARTS:
      return BadgeIds.ARTS_NOVICE;
    case TriviaCategories.FOOD:
      return BadgeIds.FOOD_NOVICE;
    case TriviaCategories.GENERAL:
      return BadgeIds.GENERAL_NOVICE;
    case TriviaCategories.GEOGRAPHY:
      return BadgeIds.GEOGRAPHY_NOVICE;
    case TriviaCategories.HISTORY:
      return BadgeIds.HISTORY_NOVICE;
    case TriviaCategories.MOVIES:
      return BadgeIds.MOVIES_NOVICE;
    case TriviaCategories.MUSIC:
      return BadgeIds.MUSIC_NOVICE;
    case TriviaCategories.SCIENCE:
      return BadgeIds.SCIENCE_NOVICE;
    case TriviaCategories.SOCIETY:
      return BadgeIds.SOCIETY_NOVICE;
    case TriviaCategories.SPORTS:
      return BadgeIds.SPORTS_NOVICE;
  }
};

export const getVeteranBadgeForCategory = (category: TriviaCategory) => {
  switch (category) {
    case TriviaCategories.ARTS:
      return BadgeIds.ARTS_VETERAN;
    case TriviaCategories.FOOD:
      return BadgeIds.FOOD_VETERAN;
    case TriviaCategories.GENERAL:
      return BadgeIds.GENERAL_VETERAN;
    case TriviaCategories.GEOGRAPHY:
      return BadgeIds.GEOGRAPHY_VETERAN;
    case TriviaCategories.HISTORY:
      return BadgeIds.HISTORY_VETERAN;
    case TriviaCategories.MOVIES:
      return BadgeIds.MOVIES_VETERAN;
    case TriviaCategories.MUSIC:
      return BadgeIds.MUSIC_VETERAN;
    case TriviaCategories.SCIENCE:
      return BadgeIds.SCIENCE_VETERAN;
    case TriviaCategories.SOCIETY:
      return BadgeIds.SOCIETY_VETERAN;
    case TriviaCategories.SPORTS:
      return BadgeIds.SPORTS_VETERAN;
  }
};

export const getChampionBadgeForCategory = (category: TriviaCategory) => {
  switch (category) {
    case TriviaCategories.ARTS:
      return BadgeIds.ARTS_CHAMPION;
    case TriviaCategories.FOOD:
      return BadgeIds.FOOD_CHAMPION;
    case TriviaCategories.GENERAL:
      return BadgeIds.GENERAL_CHAMPION;
    case TriviaCategories.GEOGRAPHY:
      return BadgeIds.GEOGRAPHY_CHAMPION;
    case TriviaCategories.HISTORY:
      return BadgeIds.HISTORY_CHAMPION;
    case TriviaCategories.MOVIES:
      return BadgeIds.MOVIES_CHAMPION;
    case TriviaCategories.MUSIC:
      return BadgeIds.MUSIC_CHAMPION;
    case TriviaCategories.SCIENCE:
      return BadgeIds.SCIENCE_CHAMPION;
    case TriviaCategories.SOCIETY:
      return BadgeIds.SOCIETY_CHAMPION;
    case TriviaCategories.SPORTS:
      return BadgeIds.SPORTS_CHAMPION;
  }
};

export const badges: { [Property in BadgeId]: Badge } = {
  [BadgeIds.SCOUT]: {
    id: BadgeIds.SCOUT,
    title: "Scout",
    description: `Reach ${SCOUT_RATING} overall rating`,
    achieveMessage: `You reached ${SCOUT_RATING} overall rating`,
    shareMessage: `I achieved the Scout badge by reaching ${SCOUT_RATING} overall rating on Smarticus trivia.`,
    Icon: Scout,
    coins: BADGE_COST_XS,
  },
  [BadgeIds.PRIVATE]: {
    id: BadgeIds.PRIVATE,
    title: "Private",
    description: `Reach ${PRIVATE_RATING} overall rating`,
    achieveMessage: `You reached ${PRIVATE_RATING} overall rating`,
    shareMessage: `I achieved the Private badge for reaching ${PRIVATE_RATING} overall rating on Smarticus trivia.`,
    Icon: Private,
    coins: BADGE_COST_SM,
  },
  [BadgeIds.RIVAL]: {
    id: BadgeIds.RIVAL,
    title: "Rival",
    description: `Reach ${RIVAL_RATING} overall rating`,
    achieveMessage: `You reached ${RIVAL_RATING} overall rating`,
    shareMessage: `I achieved the Rival badge for reaching ${RIVAL_RATING} overall rating on Smarticus trivia.`,
    Icon: Rival,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.CHALLENGER]: {
    id: BadgeIds.CHALLENGER,
    title: "Challenger",
    description: `Reach ${CHALLENGER_RATING} overall rating`,
    achieveMessage: `You reached ${CHALLENGER_RATING} overall rating`,
    shareMessage: `I achieved the Challenger badge for reaching ${CHALLENGER_RATING} overall rating on Smarticus trivia.`,
    Icon: Challenger,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.GLADIATOR]: {
    id: BadgeIds.GLADIATOR,
    title: "Gladiator",
    description: `Reach ${GLADIATOR_RATING} overall rating`,
    achieveMessage: `You reached ${GLADIATOR_RATING} overall rating`,
    shareMessage: `I achieved the Gladiator badge for reaching ${GLADIATOR_RATING} overall rating on Smarticus trivia.`,
    Icon: Gladiator,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.RANK_THREE]: {
    id: BadgeIds.RANK_THREE,
    title: "Rank Three",
    description: "Reach rank three on the leaderboard",
    achieveMessage: "You ranked 3rd on the leaderboard",
    shareMessage:
      "I achieved the Rank Three badge for reaching rank three on the Smarticus trivia leaderboard.",
    Icon: RankThree,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.RANK_TWO]: {
    id: BadgeIds.RANK_TWO,
    title: "Rank Two",
    description: "Reach rank two on the leaderboard",
    achieveMessage: "You ranked 2nd on the leaderboard",
    shareMessage:
      "I achieved the Rank Two badge for reaching rank two on the Smarticus trivia leaderboard.",
    Icon: RankTwo,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.RANK_ONE]: {
    id: BadgeIds.RANK_ONE,
    title: "Rank One",
    description: "Reach rank one on the leaderboard",
    achieveMessage: "You ranked 1st on the leaderboard",
    shareMessage:
      "I achieved the Rank One badge for reaching rank one on the Smarticus trivia leaderboard.",
    Icon: RankOne,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.VICTORIOUS]: {
    id: BadgeIds.VICTORIOUS,
    title: "Victorious",
    description: "Win a versus challenge",
    achieveMessage: "You won a versus challenge",
    shareMessage:
      "I achieved the Victorious badge for winning a multiplayer challenge on Smarticus trivia.",
    Icon: Victorious,
    coins: BADGE_COST_SM,
  },
  [BadgeIds.IRON_MAN]: {
    id: BadgeIds.IRON_MAN,
    title: "Iron Man",
    description: `Complete daily trivia ${DAILY_TRIVIA_STREAK_ACHIEVEMENT} days in a row`,
    achieveMessage: `You completed the daily trivia ${DAILY_TRIVIA_STREAK_ACHIEVEMENT} days in a row`,
    shareMessage: `I achieved the Iron Man badge for doing the Smarticus daily trivia ${DAILY_TRIVIA_STREAK_ACHIEVEMENT} days in a row.`,
    Icon: IronMan,
    coins: BADGE_COST_SM,
  },
  // [BadgeIds.REVIEWER]: {
  //   id: BadgeIds.REVIEWER,
  //   title: "Reviewer",
  //   description: "Rate or review Smarticus",
  //   achieveMessage: "You rated Smarticus",
  //   shareMessage:
  //     "I achieved the Reviewer badge for rating the Smarticus trivia app.",
  //   Icon: Reviewer,
  //   coins: 0,
  // },
  [BadgeIds.RECRUITER]: {
    id: BadgeIds.RECRUITER,
    title: "Recruiter",
    description: "Invite a friend to Smarticus",
    achieveMessage: "You invited a friend to Smarticus",
    shareMessage:
      "I achieved the Recruiter badge for inviting a friend to the Smarticus trivia app.",
    Icon: Recruiter,
    coins: 0,
  },
  [BadgeIds.MONEY_BAGS]: {
    id: BadgeIds.MONEY_BAGS,
    title: "Money Bags",
    description: `Collect ${COINS_ACHEIVEMENT} coins`,
    achieveMessage: `You collected ${COINS_ACHEIVEMENT} coins`,
    shareMessage: `I achieved the Money Bags badge for having over ${COINS_ACHEIVEMENT} coins on the Smarticus trivia app.`,
    Icon: MoneyBags,
    coins: 0,
  },
  [BadgeIds.GENERAL_NOVICE]: {
    id: BadgeIds.GENERAL_NOVICE,
    title: "General Novice",
    description: `Reach ${NOVICE_RATING} rating in General`,
    achieveMessage: `You're ${NOVICE_RATING} rated in General trivia`,
    shareMessage: `I achieved the General Trivia Novice badge on Smarticus.`,
    Icon: GeneralNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.GENERAL_VETERAN]: {
    id: BadgeIds.GENERAL_VETERAN,
    title: "General Veteran",
    description: `Reach ${VETERAN_RATING} rating in General`,
    achieveMessage: `You're ${VETERAN_RATING} rated in General trivia`,
    shareMessage: `I achieved the General Trivia Veteran badge on Smarticus.`,
    Icon: GeneralVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.GENERAL_CHAMPION]: {
    id: BadgeIds.GENERAL_CHAMPION,
    title: "General Champion",
    description: `Reach ${CHAMPION_RATING} rating in General`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in General trivia`,
    shareMessage: `I achieved the General Trivia Champion badge on Smarticus.`,
    Icon: GeneralChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.SPORTS_NOVICE]: {
    id: BadgeIds.SPORTS_NOVICE,
    title: "Sports Novice",
    description: `Reach ${NOVICE_RATING} rating in Sports`,
    achieveMessage: `You're ${NOVICE_RATING} rated in Sports trivia`,
    shareMessage: `I achieved the Sports Trivia Novice badge on Smarticus.`,
    Icon: SportsNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.SPORTS_VETERAN]: {
    id: BadgeIds.SPORTS_VETERAN,
    title: "Sports Veteran",
    description: `Reach ${VETERAN_RATING} rating in Sports`,
    achieveMessage: `You're ${VETERAN_RATING} rated in Sports trivia`,
    shareMessage: `I achieved the Sports Trivia Veteran badge on Smarticus.`,
    Icon: SportsVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.SPORTS_CHAMPION]: {
    id: BadgeIds.SPORTS_CHAMPION,
    title: "Sports Champion",
    description: `Reach ${CHAMPION_RATING} rating in Sports`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in Sports trivia`,
    shareMessage: `I achieved the Sports Trivia Champion badge on Smarticus.`,
    Icon: SportsChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.ARTS_NOVICE]: {
    id: BadgeIds.ARTS_NOVICE,
    title: "Arts Novice",
    description: `Reach ${NOVICE_RATING} rating in Arts & Literature`,
    achieveMessage: `You're ${NOVICE_RATING} rated in Arts & Literature trivia`,
    shareMessage: `I achieved the Arts & Literature Trivia Novice badge on Smarticus.`,
    Icon: ArtsNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.ARTS_VETERAN]: {
    id: BadgeIds.ARTS_VETERAN,
    title: "Arts Veteran",
    description: `Reach ${VETERAN_RATING} rating in Arts & Literature`,
    achieveMessage: `You're ${VETERAN_RATING} rated in Arts & Literature trivia`,
    shareMessage: `I achieved the Arts & Literature Trivia Veteran badge on Smarticus.`,
    Icon: ArtsVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.ARTS_CHAMPION]: {
    id: BadgeIds.ARTS_CHAMPION,
    title: "Arts Champion",
    description: `Reach ${CHAMPION_RATING} rating in Arts & Literature`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in Arts & Literature trivia`,
    shareMessage: `I achieved the Arts & Literature Trivia Champion badge on Smarticus.`,
    Icon: ArtsChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.MOVIES_NOVICE]: {
    id: BadgeIds.MOVIES_NOVICE,
    title: "Movies Novice",
    description: `Reach ${NOVICE_RATING} rating in Movies & Film`,
    achieveMessage: `You're ${NOVICE_RATING} rated in Movies & Film trivia`,
    shareMessage: `I achieved the Movies & Film Trivia Novice badge on Smarticus.`,
    Icon: MoviesNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.MOVIES_VETERAN]: {
    id: BadgeIds.MOVIES_VETERAN,
    title: "Movies Veteran",
    description: `Reach ${VETERAN_RATING} rating in Movies & Film`,
    achieveMessage: `You're ${VETERAN_RATING} rated in Movies & Film trivia`,
    shareMessage: `I achieved the Movies & Film Trivia Veteran badge on Smarticus.`,
    Icon: MoviesVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.MOVIES_CHAMPION]: {
    id: BadgeIds.MOVIES_CHAMPION,
    title: "Movies Champion",
    description: `Reach ${CHAMPION_RATING} rating in Movies & Film`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in Movies & Film trivia`,
    shareMessage: `I achieved the Movies & Film Trivia Champion badge on Smarticus.`,
    Icon: MoviesChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.SCIENCE_NOVICE]: {
    id: BadgeIds.SCIENCE_NOVICE,
    title: "Science Novice",
    description: `Reach ${NOVICE_RATING} rating in Science`,
    achieveMessage: `You're ${NOVICE_RATING} rated in Science trivia`,
    shareMessage: `I achieved the Science Trivia Novice badge on Smarticus.`,
    Icon: ScienceNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.SCIENCE_VETERAN]: {
    id: BadgeIds.SCIENCE_VETERAN,
    title: "Science Veteran",
    description: `Reach ${VETERAN_RATING} rating in Science`,
    achieveMessage: `You're ${VETERAN_RATING} rated in Science trivia`,
    shareMessage: `I achieved the Science Trivia Veteran badge on Smarticus.`,
    Icon: ScienceVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.SCIENCE_CHAMPION]: {
    id: BadgeIds.SCIENCE_CHAMPION,
    title: "Science Champion",
    description: `Reach ${CHAMPION_RATING} rating in Science`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in Science trivia`,
    shareMessage: `I achieved the Science Trivia Champion badge on Smarticus.`,
    Icon: ScienceChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.MUSIC_NOVICE]: {
    id: BadgeIds.MUSIC_NOVICE,
    title: "Music Novice",
    description: `Reach ${NOVICE_RATING} rating in Music`,
    achieveMessage: `You're ${NOVICE_RATING} rated in Music trivia`,
    shareMessage: `I achieved the Music Trivia Novice badge on Smarticus.`,
    Icon: MusicNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.MUSIC_VETERAN]: {
    id: BadgeIds.MUSIC_VETERAN,
    title: "Music Veteran",
    description: `Reach ${VETERAN_RATING} rating in Music`,
    achieveMessage: `You're ${VETERAN_RATING} rated in Music trivia`,
    shareMessage: `I achieved the Music Trivia Veteran badge on Smarticus.`,
    Icon: MusicVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.MUSIC_CHAMPION]: {
    id: BadgeIds.MUSIC_CHAMPION,
    title: "Music Champion",
    description: `Reach ${CHAMPION_RATING} rating in Music`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in Music trivia`,
    shareMessage: `I achieved the Music Trivia Champion badge on Smarticus.`,
    Icon: MusicChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.FOOD_NOVICE]: {
    id: BadgeIds.FOOD_NOVICE,
    title: "Food Novice",
    description: `Reach ${NOVICE_RATING} rating in Food & Drink`,
    achieveMessage: `You're ${NOVICE_RATING} rated in Food & Drink trivia`,
    shareMessage: `I achieved the Food & Drink Trivia Novice badge on Smarticus.`,
    Icon: FoodNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.FOOD_VETERAN]: {
    id: BadgeIds.FOOD_VETERAN,
    title: "Food Veteran",
    description: `Reach ${VETERAN_RATING} rating in Food & Drink`,
    achieveMessage: `You're ${VETERAN_RATING} rated in Food & Drink trivia`,
    shareMessage: `I achieved the Food & Drink Trivia Veteran badge on Smarticus.`,
    Icon: FoodVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.FOOD_CHAMPION]: {
    id: BadgeIds.FOOD_CHAMPION,
    title: "Food Champion",
    description: `Reach ${CHAMPION_RATING} rating in Food & Drink`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in Food & Drink trivia`,
    shareMessage: `I achieved the Food & Drink Trivia Champion badge on Smarticus.`,
    Icon: FoodChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.HISTORY_NOVICE]: {
    id: BadgeIds.HISTORY_NOVICE,
    title: "History Novice",
    description: `Reach ${NOVICE_RATING} rating in History`,
    achieveMessage: `You're ${NOVICE_RATING} rated in History trivia`,
    shareMessage: `I achieved the History Trivia Novice badge on Smarticus.`,
    Icon: HistoryNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.HISTORY_VETERAN]: {
    id: BadgeIds.HISTORY_VETERAN,
    title: "History Veteran",
    description: `Reach ${VETERAN_RATING} rating in History`,
    achieveMessage: `You're ${VETERAN_RATING} rated in History trivia`,
    shareMessage: `I achieved the History Trivia Veteran badge on Smarticus.`,
    Icon: HistoryVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.HISTORY_CHAMPION]: {
    id: BadgeIds.HISTORY_CHAMPION,
    title: "History Champion",
    description: `Reach ${CHAMPION_RATING} rating in History`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in History trivia`,
    shareMessage: `I achieved the History Trivia Champion badge on Smarticus.`,
    Icon: HistoryChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.GEOGRAPHY_NOVICE]: {
    id: BadgeIds.GEOGRAPHY_NOVICE,
    title: "Geography Novice",
    description: `Reach ${NOVICE_RATING} rating in Geography`,
    achieveMessage: `You're ${NOVICE_RATING} rated in Geography trivia`,
    shareMessage: `I achieved the Geography Trivia Novice badge on Smarticus.`,
    Icon: GeographyNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.GEOGRAPHY_VETERAN]: {
    id: BadgeIds.GEOGRAPHY_VETERAN,
    title: "Geography Veteran",
    description: `Reach ${VETERAN_RATING} rating in Geography`,
    achieveMessage: `You're ${VETERAN_RATING} rated in Geography trivia`,
    shareMessage: `I achieved the Geography Trivia Veteran badge on Smarticus.`,
    Icon: GeographyVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.GEOGRAPHY_CHAMPION]: {
    id: BadgeIds.GEOGRAPHY_CHAMPION,
    title: "Geography Champion",
    description: `Reach ${CHAMPION_RATING} rating in Geography`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in Geography trivia`,
    shareMessage: `I achieved the Geography Trivia Champion badge on Smarticus.`,
    Icon: GeographyChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.SOCIETY_NOVICE]: {
    id: BadgeIds.SOCIETY_NOVICE,
    title: "Society Novice",
    description: `Reach ${NOVICE_RATING} rating in Society & Culture`,
    achieveMessage: `You're ${NOVICE_RATING} rated in Society & Culture trivia`,
    shareMessage: `I achieved the Society & Culture Trivia Novice badge on Smarticus.`,
    Icon: SocietyNovice,
    coins: BADGE_COST_MD,
  },
  [BadgeIds.SOCIETY_VETERAN]: {
    id: BadgeIds.SOCIETY_VETERAN,
    title: "Society Veteran",
    description: `Reach ${VETERAN_RATING} rating in Society & Culture`,
    achieveMessage: `You're ${VETERAN_RATING} rated in Society & Culture trivia`,
    shareMessage: `I achieved the Society & Culture Trivia Veteran badge on Smarticus.`,
    Icon: SocietyVeteran,
    coins: BADGE_COST_LG,
  },
  [BadgeIds.SOCIETY_CHAMPION]: {
    id: BadgeIds.SOCIETY_CHAMPION,
    title: "Society Champion",
    description: `Reach ${CHAMPION_RATING} rating in Society & Culture`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in Society & Culture trivia`,
    shareMessage: `I achieved the Society & Culture Trivia Champion badge on Smarticus.`,
    Icon: SocietyChampion,
    coins: BADGE_COST_XL,
  },
  [BadgeIds.TRIVIA_MASTER]: {
    id: BadgeIds.TRIVIA_MASTER,
    title: "Trivia Master",
    description: `Reach ${CHAMPION_RATING} rating in all categories`,
    achieveMessage: `You're ${CHAMPION_RATING} rated in every category`,
    shareMessage: `I achieved the Trivia Master badge on Smarticus. ${CHAMPION_RATING} rating in every category.`,
    Icon: TriviaMaster,
    coins: BADGE_COST_XXL,
  },
  [BadgeIds.SMARTICUS]: {
    id: BadgeIds.SMARTICUS,
    title: "SMARTICUS",
    description: "Complete all achievements",
    achieveMessage: "WOW! You've completed every achievement!",
    shareMessage:
      "I am SMARTICUS! I completed every achievement in Smarticus trivia.",
    Icon: Smarticus,
    coins: BADGE_COST_XXL,
  },
};

export const shareAchievement = async (badgeId: BadgeId) => {
  const badgeData = badges[badgeId];
  const message = `${badgeData.shareMessage}\n\nhttps://smarticus.onelink.me/0hhT/playtrivia`;
  Share.open({
    title: "New Smarticus Achievement",
    subject: message,
    message,
    failOnCancel: false,
  });
};

export const getNextBadgeForCategory = (
  category: TriviaCategory | "overall" = "overall",
  rating: number | undefined = 0,
  userBadges: { [Property in BadgeId]?: UserBadge }
): NextBadgeCutOff | undefined => {
  if (category !== "overall") {
    const categoryCutOffs = [
      {
        badge: getNoviceBadgeForCategory(category),
        previousRating: 0,
        rating: NOVICE_RATING,
      },
      {
        badge: getVeteranBadgeForCategory(category),
        previousRating: NOVICE_RATING,
        rating: VETERAN_RATING,
      },
      {
        badge: getChampionBadgeForCategory(category),
        previousRating: VETERAN_RATING,
        rating: CHAMPION_RATING,
      },
    ];

    const nextCutOff = categoryCutOffs.find(
      (cutOff) => !userBadges[cutOff.badge]?.achieved && cutOff.rating > rating
    );

    if (nextCutOff) {
      return {
        badge: nextCutOff.badge,
        previousRating: nextCutOff.previousRating,
        nextRating: nextCutOff.rating,
        currentRating: rating,
        progress: rating / nextCutOff.rating,
      };
    } else {
      return undefined;
    }
  } else {
    const overallCutoffs = [
      {
        badge: BadgeIds.SCOUT,
        previousRating: DEFAULT_RATING,
        rating: SCOUT_RATING,
      },
      {
        badge: BadgeIds.PRIVATE,
        rating: PRIVATE_RATING,
        previousRating: SCOUT_RATING,
      },
      {
        badge: BadgeIds.RIVAL,
        rating: RIVAL_RATING,
        previousRating: PRIVATE_RATING,
      },
      {
        badge: BadgeIds.CHALLENGER,
        rating: CHALLENGER_RATING,
        previousRating: RIVAL_RATING,
      },
      {
        badge: BadgeIds.GLADIATOR,
        rating: GLADIATOR_RATING,
        previousRating: CHALLENGER_RATING,
      },
    ];
    const nextCutOff = overallCutoffs.find(
      (cutOff) => !userBadges[cutOff.badge]?.achieved && cutOff.rating > rating
    );

    if (nextCutOff) {
      return {
        badge: nextCutOff.badge,
        previousRating: nextCutOff.previousRating,
        nextRating: nextCutOff.rating,
        currentRating: rating,
        progress: rating / nextCutOff.rating,
      };
    } else {
      return undefined;
    }
  }
};

export const getNewBadgesForRatings = (
  ratings: Ratings,
  prevRatings: Ratings | undefined,
  userBadges: { [Property in BadgeId]?: UserBadge }
) => {
  const newBadges: BadgeId[] = [];

  if (!ratings) {
    return newBadges;
  }

  const overallRating = ratings.categories?.overall;
  if (overallRating) {
    const achievedScout = overallRating >= SCOUT_RATING;
    const achievedPrivate = overallRating >= PRIVATE_RATING;
    const achievedRival = overallRating >= RIVAL_RATING;
    const achievedChallenger = overallRating >= CHALLENGER_RATING;
    const achievedGladiator = overallRating >= GLADIATOR_RATING;

    if (achievedScout && !userBadges[BadgeIds.SCOUT]?.achieved) {
      newBadges.push(BadgeIds.SCOUT);
    }

    if (achievedPrivate && !userBadges[BadgeIds.PRIVATE]?.achieved) {
      newBadges.push(BadgeIds.PRIVATE);
    }

    if (achievedRival && !userBadges[BadgeIds.RIVAL]?.achieved) {
      newBadges.push(BadgeIds.RIVAL);
    }

    if (achievedChallenger && !userBadges[BadgeIds.CHALLENGER]?.achieved) {
      newBadges.push(BadgeIds.CHALLENGER);
    }

    if (achievedGladiator && !userBadges[BadgeIds.GLADIATOR]) {
      newBadges.push(BadgeIds.GLADIATOR);
    }
  }

  if (ratings.categories) {
    Object.entries(ratings.categories).forEach(([category, rating]) => {
      // console.log(rating, prevRatings.current?.[category], category);
      if (rating && prevRatings?.[category] !== rating) {
        const achievedNovice = rating >= NOVICE_RATING;
        const achievedVeteran = rating >= VETERAN_RATING;
        const achievedChampion = rating >= CHAMPION_RATING;

        let noviceBadgeId: BadgeId;
        if (
          achievedNovice &&
          (noviceBadgeId = getNoviceBadgeForCategory(
            category as TriviaCategory
          )) &&
          !userBadges[noviceBadgeId]?.achieved
        ) {
          newBadges.push(noviceBadgeId);
        }

        let veteranBadgeId: BadgeId;
        if (
          achievedVeteran &&
          (veteranBadgeId = getVeteranBadgeForCategory(
            category as TriviaCategory
          )) &&
          !userBadges[veteranBadgeId]?.achieved
        ) {
          newBadges.push(veteranBadgeId);
        }

        let championBadgeId: BadgeId;
        if (
          achievedChampion &&
          (championBadgeId = getChampionBadgeForCategory(
            category as TriviaCategory
          )) &&
          !userBadges[championBadgeId]?.achieved
        ) {
          newBadges.push(championBadgeId);
        }
      }
    });
  }

  return newBadges;
};
