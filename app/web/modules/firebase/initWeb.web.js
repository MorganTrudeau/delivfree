import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCXxkFMGIvCzef-kXi0o6joMaBqzs-VMRI",
  authDomain: "delivfree-dev.firebaseapp.com",
  projectId: "delivfree-dev",
  storageBucket: "delivfree-dev.appspot.com",
  messagingSenderId: "1012298016071",
  appId: "1:1012298016071:web:fbd6ef5ea49933a323d862",
};

export const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);
};
