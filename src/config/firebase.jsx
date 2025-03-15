import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider , TwitterAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBjr5FymfcZ9T6gHOU3pfzlyWnO1pvEang",
  authDomain: "tungagas-f744d.firebaseapp.com",
  projectId: "tungagas-f744d",
  storageBucket: "tungagas-f744d.firebasestorage.app",
  messagingSenderId: "853701395121",
  appId: "1:853701395121:web:164224e45051f235599890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const g_provider = new GoogleAuthProvider();
const t_provider = new TwitterAuthProvider();
const db = getFirestore(app);

export { auth, g_provider, t_provider, db };