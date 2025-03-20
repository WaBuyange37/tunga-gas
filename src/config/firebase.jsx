// Firebase configuration for TungaGas
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
// Add fallback values to prevent crashes when env vars aren't set
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Initialize Firebase with error handling
let app, auth, db, storage, g_provider

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  g_provider = new GoogleAuthProvider()
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Create mock implementations to prevent crashes
  auth = {
    onAuthStateChanged: (callback) => {
      callback(null)
      return () => {}
    },
    signOut: () => Promise.resolve(),
  }
  db = {
    collection: () => ({}),
  }
  storage = {}
  g_provider = {}
}

export { auth, db, storage, g_provider }

