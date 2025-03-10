"use client"

import React,{ useState } from "react"
import { products } from "../data/products"
import { showNotification } from "../utils/notifications"

const ShopPage = (props) => {
  const [cartItems, setCartItems] = useState([])

  // Add to cart function
  const addToCart = (product) => {
    if (product.outOfStock) return

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

  return (
    <div>
      <h1>Shop Page</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image || "/placeholder.svg"} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.description}</p>
            <button onClick={() => addToCart(product)} disabled={product.outOfStock}>
              {product.outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShopPage

