import firebase from "firebase/app";
// import functions from "./functions";

const devConfig = {
  apiKey: "AIzaSyA9ET2nGLA1t-Am4PBtWRyVQVu3ZLEWZSU",
  authDomain: "delivfree-app-dev.firebaseapp.com",
  projectId: "delivfree-app-dev",
  storageBucket: "delivfree-app-dev.appspot.com",
  messagingSenderId: "1045793418822",
  appId: "1:1045793418822:web:e4672af6516939f4e6e447",
};
const liveConfig = {
  apiKey: "AIzaSyDDKuob3VoBk8B6YVcZL0Z_HuCrZ0saODY",
  authDomain: "delivfree-app.firebaseapp.com",
  projectId: "delivfree-app",
  storageBucket: "delivfree-app.appspot.com",
  messagingSenderId: "406179880402",
  appId: "1:406179880402:web:8ca561290bd87b61297c0b",
  measurementId: "G-C1X5PN737R",
};

export const initFirebase = () => {
  firebase.initializeApp(liveConfig);
  // functions().useEmulator("localhost", 5001);
};
