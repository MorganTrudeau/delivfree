import firebase from "firebase/app";
import "firebase/functions";

const functions = firebase.functions;

// functions().useEmulator('localhost', 5001);

export { firebase };
export default functions;
