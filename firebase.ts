// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable, getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDbh8a1sqS6yy3CapjeyPfMNyBlWUNpYE",
  authDomain: "total-maxx.firebaseapp.com",
  projectId: "total-maxx",
  storageBucket: "total-maxx.appspot.com",
  messagingSenderId: "901726096412",
  appId: "1:901726096412:web:092243e06a05823611a3d9",
  measurementId: "G-9RT0JY9DP3"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore()
const auth = getAuth(firebase);
const storage = getStorage(firebase);

export {
  firebase,
  db,
  auth,
  storage,
  signInWithEmailAndPassword,
  signOut,
  collection,
  addDoc,
  doc,
  getDoc,
  getDownloadURL,
  ref,
  uploadBytesResumable
}