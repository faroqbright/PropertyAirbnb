import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuubfEHwFDMdkkiTHkSiNRal_R3fVCT7s",
  authDomain: "co-live-5e8d8.firebaseapp.com",
  projectId: "co-live-5e8d8",
  storageBucket: "co-live-5e8d8.firebasestorage.app",
  messagingSenderId: "902714543837",
  appId: "1:902714543837:web:baa91bdae27074c2f55534",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };