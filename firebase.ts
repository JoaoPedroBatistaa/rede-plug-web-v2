// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMnLVFKZSLI44XpQ-Lvxsxduo-VnJrR5Y",
  authDomain: "totalmaxsystem.firebaseapp.com",
  projectId: "totalmaxsystem",
  storageBucket: "totalmaxsystem.appspot.com",
  messagingSenderId: "206758787932",
  appId: "1:206758787932:web:ff99633176f561bd981f99"
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

async function getSupplierById(id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Supplier`, id);
  const foamSnap = await getDoc(foamDoc);
  if (foamSnap.exists()) {
    return foamSnap.data();
  } else {
    throw new Error(`No supplier found with id: ${id}`);
  }
}

async function addSupplierToLogin(foam: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Supplier`), foam);
    console.log("Fornecedor adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar fornecedor: ", e);
  }
}

async function updateSupplierInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Supplier`, id);
  await updateDoc(foamDoc, foam);
}

async function getInstalacaoById(id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Instalacao`, id);
  const foamSnap = await getDoc(foamDoc);
  if (foamSnap.exists()) {
    return foamSnap.data();
  } else {
    throw new Error(`No instalaiton found with id: ${id}`);
  }
}

async function addInstalacaoToLogin(foam: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Instalacao`), foam);
    console.log("Diversos adicionada com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar Diversos: ", e);
  }
}

async function updateInstalacaoInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Instalacao`, id);
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

async function getColagemById(id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Colagem`, id);
  const foamSnap = await getDoc(foamDoc);
  if (foamSnap.exists()) {
    return foamSnap.data();
  } else {
    throw new Error(`No foam found with id: ${id}`);
  }
}

async function updateColagemInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Colagem`, id);
  await updateDoc(foamDoc, foam);
}

async function addColagemToLogin(colagem: any, loginId: any) {
  try {
    await addDoc(collection(db, `Login/${loginId}/Colagem`), colagem);
    console.log("Colagem adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar Colagem: ", e);
  }
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

async function updateVidroInLogin(foam: any, id: string, loginId: string) {
  const foamDoc = doc(db, `Login/${loginId}/Vidro`, id);
  await updateDoc(foamDoc, foam);
}

export {
  addColagemToLogin, addDoc, addFoamToLogin,
  addImpressaoToLogin, addInstalacaoToLogin, addPaspaturToLogin, addPerfilToLogin, addSupplierToLogin, addVidroToLogin, auth, collection, db, doc, firebase, getColagemById, getDoc,
  getDownloadURL, getFoamById, getImpressaoById, getInstalacaoById, getPaspaturById, getPerfilById, getSupplierById, getVidroById, query, ref, signInWithEmailAndPassword,
  signOut, storage, updateColagemInLogin, updateFoamInLogin, updateImpressaoInLogin, updateInstalacaoInLogin, updatePaspaturInLogin, updatePerfilInLogin, updateSupplierInLogin, updateVidroInLogin, uploadBytesResumable, where
};

