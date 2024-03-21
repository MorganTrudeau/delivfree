import { Challenge } from "smarticus";

export const getNumberOfCorrectResults = (
  challenge: Challenge,
  userId: string
) => {
  const results = challenge.results?.[userId];

  return results
    ? Object.values(results).reduce((acc, result) => {
        return acc + (result?.correct ? 1 : 0);
      }, 0)
    : 0;
};

export const getNumberOfIncorrectResults = (
  challenge: Challenge,
  userId: string
) => {
  const results = challenge.results?.[userId];

  return results
    ? Object.values(results).reduce((acc, result) => {
        return acc + (!result?.correct ? 1 : 0);
      }, 0)
    : 0;
};

export const getIncorrectQuestions = (challenge: Challenge, userId: string) => {
  const results = challenge.results?.[userId];

  return results
    ? challenge.trivia[userId].filter(
        (question) => results[question.id]?.correct === false
      )
    : [];
};

export const getStealQuestions = (challenge: Challenge, userId: string) => {
  return challenge.trivia[userId].filter(
    (question) => challenge.results?.[userId]?.[question.id]?.correct === false
  );
};
