import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBo5OD5z_PWVDi_ZXE-RyHssSWv64lSZ8E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "delhiselling-2ea51.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "delhiselling-2ea51",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "delhiselling-2ea51.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "752095118103",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:752095118103:web:0a2a509deb9773bff3ed52",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3SZ1ZKXERP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };