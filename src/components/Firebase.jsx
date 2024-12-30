import { initializeApp } from "firebase/app";
import { getAuth,signOut,onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, deleteDoc, doc, updateDoc, getDocs,getDoc } from "firebase/firestore";
import { getStorage,ref, uploadBytes, getDownloadURL   } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDMb1JuaCAd_vK-hx2ZLiXQ_j7TzAI1qW4",
  authDomain: "job-portal-fefd3.firebaseapp.com",
  projectId: "job-portal-fefd3",
  storageBucket: "job-portal-fefd3.firebasestorage.app",
  messagingSenderId: "802448805123",
  appId: "1:802448805123:web:66a6af2bdf545976f4ad36",
  measurementId: "G-9ZK6LD6MDF"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app)

export { auth, app,db, storage , ref, uploadBytes, getDownloadURL, createUserWithEmailAndPassword, signInWithEmailAndPassword, collection, addDoc, deleteDoc, doc, updateDoc, getDocs,getDoc,onAuthStateChanged ,signOut,getAuth};
