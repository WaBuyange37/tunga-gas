import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db, g_provider } from "../config/firebase"

// Register a new user
export const registerUser = async (email, password, userData) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: userData.fullName,
    })

    // Prepare user data for Firestore
    const userDoc = {
      uid: userCredential.user.uid,
      email: email,
      fullName: userData.fullName,
      phone: userData.phone,
      userType: userData.userType, // customer or supplier
      location: {
        province: userData.province,
        district: userData.district,
        sector: userData.sector,
      },
      createdAt: serverTimestamp(),
    }

    // Add supplier specific data if applicable
    if (userData.userType === "supplier") {
      userDoc.business = {
        name: userData.businessName,
        description: userData.businessDescription,
        status: "pending", // Suppliers need approval
      }
    }

    // Store user data in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), userDoc)

    return userCredential.user
  } catch (error) {
    throw error
  }
}

// Login with email and password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw error
  }
}

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, g_provider)

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", result.user.uid))

    // If user doesn't exist in Firestore, create a new document
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        fullName: result.user.displayName,
        photoURL: result.user.photoURL,
        userType: "customer", // Default to customer
        createdAt: serverTimestamp(),
      })
    }

    return result.user
  } catch (error) {
    throw error
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return true
  } catch (error) {
    throw error
  }
}

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return true
  } catch (error) {
    throw error
  }
}

// Get current user data from Firestore
export const getCurrentUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data()
    } else {
      return null
    }
  } catch (error) {
    throw error
  }
}

