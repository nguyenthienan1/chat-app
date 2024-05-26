// Import the functions you need from the SDKs you need
import { GoogleAuthProvider } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh2romy9yj6cLs4caLzS94qQ4NVlB8_jo",
  authDomain: "chat-c54d1.firebaseapp.com",
  projectId: "chat-c54d1",
  storageBucket: "chat-c54d1.appspot.com",
  messagingSenderId: "98682218745",
  appId: "1:98682218745:web:979d06f97f4b628f271a28",
  measurementId: "G-9LZYPR10SR"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = getFirestore(app);

auth.useEmulator("http://localhost:9099");
if (window.location.hostname == 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { auth, db };
export default firebase;