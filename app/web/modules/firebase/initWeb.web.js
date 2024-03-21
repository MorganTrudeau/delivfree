import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAKOSDmdUpVxNpBbkdgfIJ3TxTF9RD4Gbw",
  authDomain: "trivia-b4527.firebaseapp.com",
  projectId: "trivia-b4527",
  storageBucket: "trivia-b4527.appspot.com",
  messagingSenderId: "305022913578",
  appId: "1:305022913578:web:26da94d29a1f2a8a0ac753",
  measurementId: "G-D64YYQBEVH",
};

export const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);
};
