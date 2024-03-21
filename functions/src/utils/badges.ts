import * as admin from "firebase-admin";
import {
  BadgeIds,
  Ratings,
  TriviaCategories,
  TriviaCategory,
  UserBadge,
  BadgeId,
  CHALLENGER_RATING,
  CHAMPION_RATING,
  GLADIATOR_RATING,
  NOVICE_RATING,
  PRIVATE_RATING,
  RIVAL_RATING,
  SCOUT_RATING,
  VETERAN_RATING,
} from "../types";

export const awardRankBadges = async (
  ranksBefore: Ratings["ranks"] | undefined,
  ranksAfter: Ratings["ranks"] | undefined,
  userId: string
) => {
  if (!ranksAfter) {
    return null;
  }

  let achievedThird = false;
  let achievedSecond = false;
  let achievedFirst = false;

  Object.entries(ranksAfter).forEach((entry) => {
    const category = entry[0] as TriviaCategory;
    const rank = entry[1];

    const rankBefore = ranksBefore?.[category];

    if (rank === 1 && (!rankBefore || rankBefore > 1)) {
      achievedThird = true;
      achievedSecond = true;
      achievedFirst = true;
    } else if (rank === 2 && (!rankBefore || rankBefore > 2)) {
      achievedThird = true;
      achievedSecond = true;
    } else if (rank === 3 && (!rankBefore || rankBefore > 3)) {
      achievedThird = true;
    }
  });

  const badgesCollection = admin
    .firestore()
    .collection("Users")
    .doc(userId)
    .collection("Badges");

  if (achievedThird) {
    const rankThreeBadgeRef = badgesCollection.doc(BadgeIds.RANK_THREE);
    const rankThreeBadgeDoc = await rankThreeBadgeRef.get();
    const rankThreeBadge = rankThreeBadgeDoc.data() as UserBadge | undefined;
    if (!rankThreeBadge?.achieved) {
      const achievedRankThreeBadge: UserBadge = {
        badgeId: BadgeIds.RANK_THREE,
        achieved: true,
        collected: false,
        achievedTimestamp: Date.now(),
        collectedTimestamp: null,
        acknowledged: false,
      };
      await rankThreeBadgeRef.set(achievedRankThreeBadge);
    }
  }

  if (achievedSecond) {
    const rankTwoBadgeRef = badgesCollection.doc(BadgeIds.RANK_TWO);
    const rankTwoBadgeDoc = await rankTwoBadgeRef.get();
    const rankTwoBadge = rankTwoBadgeDoc.data() as UserBadge | undefined;
    if (!rankTwoBadge?.achieved) {
      const achievedRankTwoBadge: UserBadge = {
        badgeId: BadgeIds.RANK_TWO,
        achieved: true,
        collected: false,
        achievedTimestamp: Date.now(),
        collectedTimestamp: null,
        acknowledged: false,
      };
      await rankTwoBadgeRef.set(achievedRankTwoBadge);
    }
  }

  if (achievedFirst) {
    const rankOneBadgeRef = badgesCollection.doc(BadgeIds.RANK_ONE);
    const rankOneBadgeDoc = await rankOneBadgeRef.get();
    const rankOneBadge = rankOneBadgeDoc.data() as UserBadge | undefined;
    if (!rankOneBadge?.achieved) {
      const achievedRankOneBadge: UserBadge = {
        badgeId: BadgeIds.RANK_ONE,
        achieved: true,
        collected: false,
        achievedTimestamp: Date.now(),
        collectedTimestamp: null,
        acknowledged: false,
      };
      await rankOneBadgeRef.set(achievedRankOneBadge);
    }
  }

  return null;
};

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

export const getBadgesForRatings = (ratings: Ratings["categories"]) => {
  const newBadges: BadgeId[] = [];

  if (!ratings) {
    return newBadges;
  }

  const overallRating = ratings?.overall;
  if (overallRating) {
    const achievedScout = overallRating >= SCOUT_RATING;
    const achievedPrivate = overallRating >= PRIVATE_RATING;
    const achievedRival = overallRating >= RIVAL_RATING;
    const achievedChallenger = overallRating >= CHALLENGER_RATING;
    const achievedGladiator = overallRating >= GLADIATOR_RATING;

    if (achievedScout) {
      newBadges.push(BadgeIds.SCOUT);
    }

    if (achievedPrivate) {
      newBadges.push(BadgeIds.PRIVATE);
    }

    if (achievedRival) {
      newBadges.push(BadgeIds.RIVAL);
    }

    if (achievedChallenger) {
      newBadges.push(BadgeIds.CHALLENGER);
    }

    if (achievedGladiator) {
      newBadges.push(BadgeIds.GLADIATOR);
    }
  }

  if (ratings) {
    Object.entries(ratings).forEach(([category, rating]) => {
      // console.log(rating, prevRatings.current?.[category], category);

      const achievedNovice = rating >= NOVICE_RATING;
      const achievedVeteran = rating >= VETERAN_RATING;
      const achievedChampion = rating >= CHAMPION_RATING;

      let noviceBadgeId: BadgeId;
      if (
        achievedNovice &&
        (noviceBadgeId = getNoviceBadgeForCategory(category as TriviaCategory))
      ) {
        newBadges.push(noviceBadgeId);
      }

      let veteranBadgeId: BadgeId;
      if (
        achievedVeteran &&
        (veteranBadgeId = getVeteranBadgeForCategory(
          category as TriviaCategory
        ))
      ) {
        newBadges.push(veteranBadgeId);
      }

      let championBadgeId: BadgeId;
      if (
        achievedChampion &&
        (championBadgeId = getChampionBadgeForCategory(
          category as TriviaCategory
        ))
      ) {
        newBadges.push(championBadgeId);
      }
    });
  }

  return newBadges;
};
