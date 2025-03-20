"use client"

<<<<<<< HEAD
import React, { useState, useEffect } from "react"
=======
import React,{ useState, useEffect } from "react"
>>>>>>> recovered-branch
import { Link } from "react-router-dom"
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa"
import "./WishlistPage.css"

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (e) {
        console.error("Error parsing wishlist data:", e)
      }
    }
    setLoading(false)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const removeFromWishlist = (productId) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== productId))
    showNotification("Item removed from wishlist", "info")
  }

  const addToCart = (product) => {
    // Get current cart
    const savedCart = localStorage.getItem("cart")
    let cart = []

    if (savedCart) {
      try {
        cart = JSON.parse(savedCart)
      } catch (e) {
        console.error("Error parsing cart data:", e)
      }
    }

    // Check if product already in cart
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      // Update quantity
      cart = cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      // Add new item
      cart.push({ ...product, quantity: 1 })
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch event for other components to update
    window.dispatchEvent(new Event("cartUpdated"))

    showNotification(`${product.name} added to cart`, "success")
  }

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading wishlist...</p>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      <div className="container">
        <h1 className="wishlist-title">My Wishlist</h1>

        {wishlistItems.length > 0 ? (
          <div className="wishlist-items">
            {wishlistItems.map((item) => (
              <div className="wishlist-item" key={item.id}>
                <div className="wishlist-item-image">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=150&width=150"
                    }}
                  />
                </div>
                <div className="wishlist-item-details">
                  <h3 className="wishlist-item-name">{item.name}</h3>
                  <p className="wishlist-item-price">RWF {item.price?.toLocaleString()}</p>
                  <div className="wishlist-item-actions">
                    <button className="btn btn-primary" onClick={() => addToCart(item)}>
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <button className="btn btn-outline" onClick={() => removeFromWishlist(item.id)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <FaHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Browse our products and add items to your wishlist</p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage

