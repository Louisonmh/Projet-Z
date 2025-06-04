// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON-PROJET.firebaseapp.com",
  projectId: "TON-PROJET",
  storageBucket: "TON-PROJET.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghij"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
