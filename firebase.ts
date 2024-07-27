import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBaUu05xcOrXnwyeIXAMUpTzSUpmzkH7cc",
  authDomain: "chat-with-pdf-5b623.firebaseapp.com",
  projectId: "chat-with-pdf-5b623",
  storageBucket: "chat-with-pdf-5b623.appspot.com",
  messagingSenderId: "94475662112",
  appId: "1:94475662112:web:49f11afdd727cd6e929d45",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
