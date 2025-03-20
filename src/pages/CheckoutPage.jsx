"use client"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { Navigate } from "react-router-dom"
import CheckoutForm from "../components/checkout/CheckoutForm"
import "./CheckoutPage.css"
import React from "react"

const CheckoutPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth()
  const { cart } = useCart()

  // Redirect if cart is empty
  if (cart.length === 0) {
    return <Navigate to="/cart" />
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <CheckoutForm />
      </div>
    </div>
  )
}

export default CheckoutPage

