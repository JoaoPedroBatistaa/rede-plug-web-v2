// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  where,
  query,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
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
  measurementId: "G-9RT0JY9DP3",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(firebase);
const storage = getStorage(firebase);

async function addFoamToLogin(foam: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Foam`), foam);
    console.log("Foam adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar Foam: ", e);
  }
}

async function addImpressaoToLogin(impressao: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Impressao`), impressao);
    console.log("Impressão adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar Impressão: ", e);
  }
}

async function addPaspaturToLogin(paspatur: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Paspatur`), paspatur);
    console.log("Paspatur adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar paspatur: ", e);
  }
}

async function addPerfilToLogin(perfil: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Perfil`), perfil);
    console.log("Perfil adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar Perfil: ", e);
  }
}

async function addVidroToLogin(vidro: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Vidro`), vidro);
    console.log("Vidro adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar Vidro: ", e);
  }
}
async function addColagemToLogin(colagem: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Colagem`), colagem);
    console.log("Colagem adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar Colagem: ", e);
  }
}

export {
  firebase,
  db,
  auth,
  storage,
  addPaspaturToLogin,
  addFoamToLogin,
  addImpressaoToLogin,
  addPerfilToLogin,
  addVidroToLogin,
  signInWithEmailAndPassword,
  signOut,
  collection,
  addDoc,
  doc,
  getDoc,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  query,
  where,
  addColagemToLogin,
};
