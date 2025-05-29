"use client"

import { Link } from "react-router-dom"
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaHeart, FaCheck } from "react-icons/fa"
import "./B2CSection.css"
import React,{ useState, useEffect } from "react"

const B2CSection = (props) => {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedWishlist = localStorage.getItem("wishlist")

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error parsing cart data:", e)
      }
    }

    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (e) {
        console.error("Error parsing wishlist data:", e)
      }
    }
  }, [])

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
    window.dispatchEvent(new Event("cartUpdated"))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 60000)
  }

  const products = [
    {
      id: 1,
      name: "6kg Gas Cylinder",
      price: 12000,
      rating: 4.5,
      reviews: 24,
      image: "/images/ga2.jpeg",
    },
    {
      id: 2,
      name: "12kg Gas Cylinder",
      price: 22000,
      rating: 5,
      reviews: 18,
      image: "/images/gas3.jpeg",
    },
    {
      id: 3,
      name: "15kg Gas Cylinder",
      price: 28000,
      rating: 4,
      reviews: 12,
      image: "/images/gas1.jpeg",
    },
    {
      id: 4,
      name: "Gas Stove - Single Burner",
      price: 15000,
      rating: 4.5,
      reviews: 32,
      image: "/images/mai-gas.jpeg",
    },
  ]

  // Add to cart function
  const addToCart = (product) => {
    // Use the addToCart prop from App.js if available, otherwise use local implementation
    if (props.addToCart) {
      props.addToCart(product, 1)
      showNotification(`Added ${product.name} to cart`)
    } else {
      const existingItem = cartItems.find((item) => item.id === product.id)

      if (existingItem) {
        // If item already exists, increase quantity
        const updatedCart = cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        setCartItems(updatedCart)
        showNotification(`Increased ${product.name} quantity in cart`)
      } else {
        // Add new item to cart
        setCartItems([...cartItems, { ...product, quantity: 1 }])
        showNotification(`Added ${product.name} to cart`)
      }
    }
  }

  // Toggle wishlist function
  const toggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some((item) => item.id === product.id)

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter((item) => item.id !== product.id)
      setWishlistItems(updatedWishlist)
      showNotification(`Removed ${product.name} from wishlist`, "info")
    } else {
      // Add to wishlist
      setWishlistItems([...wishlistItems, product])
      showNotification(`Added ${product.name} to wishlist`)
    }
  }

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId)
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const renderRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />)
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" />)
    }

    return stars
  }

  return (
    <section className="b2c-section">
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      <div className="container">
        <div className="b2c-header">
          <h2>Shop Gas Products</h2>
          <p>Quality gas cylinders and accessories for your home</p>
        </div>

        <div className="b2c-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-container">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg"
                  }}
                />
                <div className="product-actions">
                  <button
                    className={`product-action-btn ${isInWishlist(product.id) ? "active" : ""}`}
                    onClick={() => toggleWishlist(product)}
                  >
                    <FaHeart />
                  </button>
                  <button
                    className={`product-action-btn ${isInCart(product.id) ? "active" : ""}`}
                    onClick={() => addToCart(product)}
                  >
                    {isInCart(product.id) ? <FaCheck /> : <FaShoppingCart />}
                  </button>
                </div>
              </div>
              <div className="product-content">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">RWF {product.price.toLocaleString()}</div>
                <div className="product-rating">
                  {renderRatingStars(product.rating)}
                  <span>({product.reviews})</span>
                </div>
                <div className="product-footer">
                  <button
                    className={`btn btn-primary ${isInCart(product.id) ? "btn-success" : ""}`}
                    onClick={() => addToCart(product)}
                  >
                    {isInCart(product.id) ? (
                      <>
                        <FaCheck /> Added to Cart
                      </>
                    ) : (
                      <>
                        <FaShoppingCart /> Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    className={`btn btn-outline ${isInWishlist(product.id) ? "active" : ""}`}
                    onClick={() => toggleWishlist(product)}
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/shop" className="btn btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default B2CSection

