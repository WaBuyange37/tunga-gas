"use client"

import React,{ useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart } from "react-icons/fa"
import "./Cart.css"

const Cart = ({ cart = [], removeFromCart, updateCartItemQuantity, clearCart }) => {
  const [isLoading, setIsLoading] = useState(true)

  // Add this near the top of the component, after the useState
  console.log("Cart data received:", cart)

  useEffect(() => {
    // Short timeout to simulate loading and ensure DOM is ready
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calculate delivery fee
  const deliveryFee = subtotal > 0 ? 2000 : 0

  // Calculate tax (18% VAT)
  const tax = subtotal * 0.18

  // Calculate total
  const total = subtotal + deliveryFee + tax

  if (isLoading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    )
  }

  // Also, let's modify the empty cart check to be more robust
  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">
          <FaShoppingCart />
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any products to your cart yet.</p>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <div className="cart-header-item product">Product</div>
        <div className="cart-header-item price">Price</div>
        <div className="cart-header-item quantity">Quantity</div>
        <div className="cart-header-item subtotal">Subtotal</div>
        <div className="cart-header-item actions">Actions</div>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="cart-item-product">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="cart-item-image"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=80&width=80"
                }}
              />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-category">{item.category}</p>
              </div>
            </div>
            <div className="cart-item-price">RWF {item.price.toLocaleString()}</div>
            <div className="cart-item-quantity">
              <button
                className="quantity-btn"
                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <FaMinus />
              </button>
              <span className="quantity-value">{item.quantity}</span>
              <button className="quantity-btn" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                <FaPlus />
              </button>
            </div>
            <div className="cart-item-subtotal">RWF {(item.price * item.quantity).toLocaleString()}</div>
            <div className="cart-item-actions">
              <button className="remove-btn" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-actions">
        <button className="btn btn-outline" onClick={clearCart}>
          Clear Cart
        </button>
        <Link to="/shop" className="btn btn-outline">
          <FaArrowLeft /> Continue Shopping
        </Link>
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>RWF {subtotal.toLocaleString()}</span>
        </div>
        <div className="cart-summary-row">
          <span>Delivery Fee</span>
          <span>RWF {deliveryFee.toLocaleString()}</span>
        </div>
        <div className="cart-summary-row">
          <span>Tax (18% VAT)</span>
          <span>RWF {tax.toLocaleString()}</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total</span>
          <span>RWF {total.toLocaleString()}</span>
        </div>
        <Link to="/checkout" className="btn btn-primary checkout-btn">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart

