// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLI4OuFxijCmXvHpcPWE5mNOvIYh-N3vY",
  authDomain: "pantry-tracker-5db39.firebaseapp.com",
  projectId: "pantry-tracker-5db39",
  storageBucket: "pantry-tracker-5db39.appspot.com",
  messagingSenderId: "96743139077",
  appId: "1:96743139077:web:bff695d3ed254f4814b96c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
