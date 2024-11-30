import firestore from "@react-native-firebase/firestore";
import { Cuisine } from "delivfree";

export const listenToCuisines = (onData: (cuisines: Cuisine[]) => void) => {
  return firestore()
    .collection("Cuisines")
    .onSnapshot((snap) => {
      console.log("DOCS", snap.docs);
      if (!snap) {
        onData([]);
      }
      const data = snap.docs
        .map((doc) => doc.data() as Cuisine)
        .sort((a, b) => {
          if (typeof a.order === "number" && typeof b.order === "number") {
            return a.order - b.order;
          }
          if (typeof a.order === "number" && typeof b.order !== "number") {
            return -1;
          }
          if (typeof b.order === "number" && typeof a.order !== "number") {
            return 1;
          }
          return 0;
        });
      onData(data);
    });
};
