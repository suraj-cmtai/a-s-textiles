const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getDatabase } = require("firebase/database");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Firestore DB Initialization
const db = getFirestore(app);

// Load Firebase service account credentials
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

// Initialize Firebase App (Only if not already initialized)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    });
}
// Realtime Database Initialization
const rtdb = getDatabase(); // RTDB instance

module.exports = { db, admin, rtdb };
