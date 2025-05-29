import React from "react"
import Checkout from "../components/Checkout"
import "./CheckoutPage.css"

const CheckoutPage = ({ cart, removeFromCart, updateCartItemQuantity, clearCart }) => {
  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <Checkout 
          cart={cart}
          removeFromCart={removeFromCart}
          updateCartItemQuantity={updateCartItemQuantity}
          clearCart={clearCart}
        />
      </div>
    </div>
  )
}

export default CheckoutPage

