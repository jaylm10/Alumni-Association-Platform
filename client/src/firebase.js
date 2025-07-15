import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKGUfsxhJR_hVM3DTix7-dWkYzWfcEw8I",
  authDomain: "alumni-association-platf-8b782.firebaseapp.com",
  projectId: "alumni-association-platf-8b782",
  storageBucket: "alumni-association-platf-8b782.firebasestorage.app",
  messagingSenderId: "726236115982",
  appId: "1:726236115982:web:b8fc50b6670d27665c785f"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, signInWithPopup };