import { Ratings, TriviaCategory } from "delivfree";
import firestore from "./firestoreMock";

export const categories = [
  "Geography",
  "Science",
  "Sports",
  "History",
  "Movies",
  "Music",
  "Pop Culture",
  "Literature",
  "Food and Drink",
  "Technology",
  "Nature and Animals",
  "Mythology",
  "Art and Culture",
] as const;

const updateRanks = async () => {
  const ratingsCollection = firestore().collection("Ratings");
  const ratingsSnapshot = await ratingsCollection.get();

  const ratings: (Ratings & { id: string })[] = ratingsSnapshot.docs.map(
    (doc) => ({
      ...(doc.data() as Ratings),
      id: doc.id,
    })
  );

  const ratingsSortedByCategory = categories.reduce((acc, category) => {
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
  }, {} as { [Property in TriviaCategory]: (Ratings & { id: string })[] });

  const writes: Promise<any>[] = [];

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
    writes.push(ratingsCollection.doc(docId).set({ ranks }, { merge: true }));
  });

  return Promise.all(writes);
};

describe("Update ranks", () => {
  it("should calc rank for each category", async () => {
    const ratingsCollection = firestore().collection("Ratings");

    const ratings: (Ratings & { id: string })[] = [
      {
        id: "1",
        categories: { history: 800, geography: 200, science: 500 },
      },
      { id: "2", categories: { history: 1200, science: 300 } },
      {
        id: "3",
        categories: { history: 600, geography: 400, science: 100 },
      },
    ];

    await Promise.all(
      ratings.map((rating) => ratingsCollection.doc(rating.id).set(rating))
    );

    await updateRanks();

    const snapshot = await ratingsCollection.get();

    const one = snapshot.docs.find((d) => d.id === "1");
    const two = snapshot.docs.find((d) => d.id === "2");
    const three = snapshot.docs.find((d) => d.id === "3");

    expect(one?.data().ranks.History).toEqual(2);
    expect(one?.data().ranks.Geography).toEqual(2);
    expect(one?.data().ranks.Science).toEqual(1);

    expect(two?.data().ranks.History).toEqual(1);
    expect(two?.data().ranks.Geography).toEqual(undefined);
    expect(two?.data().ranks.Science).toEqual(2);

    expect(three?.data().ranks.History).toEqual(3);
    expect(three?.data().ranks.Geography).toEqual(1);
    expect(three?.data().ranks.Science).toEqual(3);
  });
});
