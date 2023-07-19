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
  updateDoc,
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

async function getFoamById(id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Foam`, id);
  const foamSnap = await getDoc(foamDoc);
  if (foamSnap.exists()) {
    return foamSnap.data();
  } else {
    throw new Error(`No foam found with id: ${id}`);
  }
}

async function addFoamToLogin(foam: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Foam`), foam);
    console.log("Foam adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar Foam: ", e);
  }
}

async function updateFoamInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Foam`, id);
  await updateDoc(foamDoc, foam);
}

async function getImpressaoById(id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Impressao`, id);
  const foamSnap = await getDoc(foamDoc);
  if (foamSnap.exists()) {
    return foamSnap.data();
  } else {
    throw new Error(`No foam found with id: ${id}`);
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

async function updateImpressaoInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Impressao`, id);
  await updateDoc(foamDoc, foam);
}

async function getPaspaturById(id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Paspatur`, id);
  const foamSnap = await getDoc(foamDoc);
  if (foamSnap.exists()) {
    return foamSnap.data();
  } else {
    throw new Error(`No foam found with id: ${id}`);
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

async function updatePaspaturInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Paspatur`, id);
  await updateDoc(foamDoc, foam);
}

async function getPerfilById(id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Perfil`, id);
  const foamSnap = await getDoc(foamDoc);
  if (foamSnap.exists()) {
    return foamSnap.data();
  } else {
    throw new Error(`No foam found with id: ${id}`);
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

async function updatePerfilInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Perfil`, id);
  await updateDoc(foamDoc, foam);
}

async function getVidroById(id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Vidro`, id);
  const foamSnap = await getDoc(foamDoc);
  if (foamSnap.exists()) {
    return foamSnap.data();
  } else {
    throw new Error(`No foam found with id: ${id}`);
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

async function updateVidroInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Vidro`, id);
  await updateDoc(foamDoc, foam);
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
