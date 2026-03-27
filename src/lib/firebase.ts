import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCpzoIC_x-7XErjNqDTjtTf0hVcE52CCsQ",
  authDomain: "pani-puri-784c6.firebaseapp.com",
  databaseURL: "https://pani-puri-784c6-default-rtdb.firebaseio.com",
  projectId: "pani-puri-784c6",
  storageBucket: "pani-puri-784c6.firebasestorage.app",
  messagingSenderId: "652444846026",
  appId: "1:652444846026:web:dee6cfe904fdf74aa1b133",
  measurementId: "G-515DHE7B1J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export default app;