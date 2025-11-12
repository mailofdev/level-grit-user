// src/config/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // import Firestore
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// Firebase config
// Supports both environment variables and hardcoded fallbacks
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY || process.env.REACT_APP_A_P_I_K_E_Y || "AIzaSyDIc0BmV1WKvY4Z2FJcY2yT9Q2ib82mnm4",
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || process.env.REACT_APP_A_U_T_H_D_O_M_A_I_N || "level-grit-messagener.firebaseapp.com",
  projectId: process.env.REACT_APP_PROJECT_ID || process.env.REACT_APP_P_R_O_J_E_C_T_I_D || "level-grit-messagener",
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || "level-grit-messagener.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || "1089513508999",
  appId: process.env.REACT_APP_APP_ID || "1:1089513508999:web:d743cc61faf3d69ff56822",
  measurementId: process.env.REACT_APP_MEASUREMENT_ID || "G-QJC7G1BZKD",
  // databaseURL is optional for Firestore, but some configs might require it
  databaseURL: process.env.REACT_APP_DATABASE_URL || process.env.REACT_APP_D_A_T_A_B_A_S_E_U_R_L || undefined,
};

// Initialize Firebase (avoid multiple initializations)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firestore and export it
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics initialization error:', error);
  }
}

// Initialize Messaging (only in browser and if service worker is available)
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.log('Messaging initialization error:', error);
  }
}

export { app, analytics, messaging };
