import firebase from "firebase/app";
import functions from "./functions";

const firebaseConfig = {
  apiKey: "AIzaSyDDKuob3VoBk8B6YVcZL0Z_HuCrZ0saODY",
  authDomain: "delivfree-app.firebaseapp.com",
  projectId: "delivfree-app",
  storageBucket: "delivfree-app.appspot.com",
  messagingSenderId: "406179880402",
  appId: "1:406179880402:web:8ca561290bd87b61297c0b",
  measurementId: "G-C1X5PN737R",
};

export const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);
  functions().useEmulator("localhost", 5001);
};
