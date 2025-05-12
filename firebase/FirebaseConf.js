// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAggDJXu3M3V7sotGM1VLXcSYE562W15c",
  authDomain: "ejemplosreact.firebaseapp.com",
  projectId: "ejemplosreact",
  storageBucket: "ejemplosreact.firebasestorage.app",
  messagingSenderId: "511325417475",
  appId: "1:511325417475:web:6d5ee773fb9c072885de36",
  measurementId: "G-SM11DS60RD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, app, db, storage}