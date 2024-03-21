const getRatingDelta = (
  myRating: number,
  opponentRating: number,
  myGameResult: 0 | 0.5 | 1
) => {
  if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
    return 0;
  }

  const myChanceToWin =
    1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

  return Math.round(32 * (myGameResult - myChanceToWin));
};

const getNewRating = (
  myRating: number,
  opponentRating: number,
  myGameResult: 0 | 0.5 | 1
) => {
  return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
};

describe("ratings", () => {
  test("should increase rating on higher rating question", () => {
    const initalRating = 800;
    const questionRating = 900;

    const newRating = getNewRating(initalRating, questionRating, 1);

    expect(newRating).toBeGreaterThan(initalRating);
  });
  test("should increase rating on much higher rating question", () => {
    const initalRating = 800;
    const questionRating = 3000;

    const newRating = getNewRating(initalRating, questionRating, 1);

    expect(newRating).toBeGreaterThan(initalRating);
  });
  test("should decrease rating on lower rating question", () => {
    const initalRating = 800;
    const questionRating = 700;

    const newRating = getNewRating(initalRating, questionRating, 0);

    expect(newRating).toBeLessThan(initalRating);
  });
  test("should decrease rating on much lower rating question", () => {
    const initalRating = 2000;
    const questionRating = 700;

    const newRating = getNewRating(initalRating, questionRating, 0);

    expect(newRating).toBeLessThan(initalRating);
  });
});
