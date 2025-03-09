import React from "react"
import Checkout from "../components/Checkout"
import "./CheckoutPage.css"

const CheckoutPage = () => {
  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <Checkout />
      </div>
    </div>
  )
}

export default CheckoutPage

