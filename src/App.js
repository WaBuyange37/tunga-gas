"use client"

<<<<<<< HEAD
import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { auth } from "./config/firebase"
import { onAuthStateChanged } from "firebase/auth"
=======
import React,{ useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./config/firebase"
>>>>>>> recovered-branch
import "./App.css"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ShopPage from "./pages/ShopPage"
import SuppliersPage from "./pages/SuppliersPage"
import TrackingPage from "./pages/TrackingPage"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import CheckoutPage from "./pages/CheckoutPage"
import CartPage from "./pages/CartPage"
import ProfilePage from "./pages/ProfilePage"
import WishlistPage from "./pages/WishlistPage"
<<<<<<< HEAD
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Load cart from localStorage on initial render
=======
import AdminDashboard from "./components/admin/AdminDashboard"
import OrderConfirmationPage from "./pages/OrderConfirmationPage"
import ProtectedRoute from "./components/ProtectedRoute"

// Load Flutterwave script
const loadFlutterwaveScript = () => {
  try {
    const script = document.createElement("script")
    script.src = "https://checkout.flutterwave.com/v3.js"
    script.async = true
    document.body.appendChild(script)
  } catch (error) {
    console.error("Error loading Flutterwave script:", error)
  }
}

function App() {
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check authentication state
>>>>>>> recovered-branch
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user)
          setLoading(false)
        },
        (error) => {
          console.error("Auth state change error:", error)
          setError(error.message)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Auth setup error:", error)
      setError(error.message)
      setLoading(false)
    }
  }, [])

  // Load Flutterwave script
  useEffect(() => {
    loadFlutterwaveScript()
  }, [])

<<<<<<< HEAD
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity < 1) return

    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
=======
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <p>Please check your configuration and try again.</p>
      </div>
    )
>>>>>>> recovered-branch
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
<<<<<<< HEAD
    <Router>
      <div className="app">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route path="/shop" element={<ShopPage addToCart={addToCart} />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute user={currentUser}>
                  <TrackingPage />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={currentUser ? <Navigate to="/shop" /> : <LoginPage />} />
            <Route path="/signup" element={currentUser ? <Navigate to="/shop" /> : <SignupPage />} />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateCartItemQuantity={updateCartItemQuantity}
                  clearCart={clearCart}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute user={currentUser}>
                  <CheckoutPage
                    cart={cart}
                    removeFromCart={removeFromCart}
                    updateCartItemQuantity={updateCartItemQuantity}
                    clearCart={clearCart}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={currentUser}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute user={currentUser}>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute user={currentUser} adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
=======
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route
                  path="/tracking"
                  element={
                    <ProtectedRoute>
                      <TrackingPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirmation/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
>>>>>>> recovered-branch
  )
}

export default App

