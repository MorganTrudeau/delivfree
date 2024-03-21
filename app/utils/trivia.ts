import { DEFAULT_RATING, Ratings, TriviaCategory } from "smarticus";

export const getGameRating = (
  category: TriviaCategory | "random" | null | undefined,
  ratings: Ratings | null | undefined
) => {
  const ratingsCategories = ratings?.categories;

  if (!(ratingsCategories && category)) {
    return DEFAULT_RATING;
  }

  if (category === "random") {
    if (!ratingsCategories.overall) {
      return DEFAULT_RATING;
    } else {
      const numberOfRatedCategories = Object.keys(ratingsCategories).length - 1; // categories without overall;
      return ratingsCategories.overall / numberOfRatedCategories;
    }
  }

  return ratingsCategories[category] || DEFAULT_RATING;
};
