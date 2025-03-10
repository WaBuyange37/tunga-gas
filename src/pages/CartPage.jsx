import Cart from "../components/Cart"
import "./CartPage.css"
import React from "react"

const CartPage = ({ cart, removeFromCart, updateCartItemQuantity, clearCart }) => {
  console.log("CartPage received cart:", cart)
  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-page-title">Your Shopping Cart</h1>
        <Cart
          cart={cart}
          removeFromCart={removeFromCart}
          updateCartItemQuantity={updateCartItemQuantity}
          clearCart={clearCart}
        />
      </div>
    </div>
  )
}

export default CartPage

