// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBVJ0wpz3wzdi5eum3SeHTYn9-M2oVF1qw",
  authDomain: "traphoneverification.firebaseapp.com",
  projectId: "traphoneverification",
  storageBucket: "traphoneverification.firebasestorage.app",
  messagingSenderId: "327419331985",
  appId: "1:327419331985:web:8885ec6410fc77f6a10630",
  measurementId: "G-QT7CSN6HR3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth, RecaptchaVerifier, signInWithPhoneNumber };

