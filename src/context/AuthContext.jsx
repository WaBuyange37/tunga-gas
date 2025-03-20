"use client"

import React,{ createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../config/firebase"
import { getCurrentUserData } from "../services/authService"

// Create context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getCurrentUserData(user.uid)
          setUserData(userDoc)
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  // Combine Firebase user and Firestore data
  const user = currentUser
    ? {
        ...currentUser,
        ...userData,
      }
    : null

  // Context value
  const value = {
    user,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext)
}

