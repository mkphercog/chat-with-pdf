import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-agj8Njeqp9nrJM8QHPcBrurw2iVTDiY",
  authDomain: "chat-with-pdf-mh.firebaseapp.com",
  projectId: "chat-with-pdf-mh",
  storageBucket: "chat-with-pdf-mh.appspot.com",
  messagingSenderId: "518532026592",
  appId: "1:518532026592:web:4ea5b19feb20a97ea98085",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
