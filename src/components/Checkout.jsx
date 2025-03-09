"use client"

import React,{ useState } from "react"
import { FaCreditCard, FaMobileAlt, FaMoneyBillWave } from "react-icons/fa"
import "./Checkout.css"

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const cartItems = [
    {
      id: 1,
      name: "12kg Gas Cylinder",
      price: 22000,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Gas Stove - Single Burner",
      price: 15000,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = 2000
  const tax = subtotal * 0.18
  const total = subtotal + deliveryFee + tax

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process checkout
    alert("Order placed successfully!")
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-form">
          <h2 className="mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode" className="form-label">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  className="form-input"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h2 className="mb-4 mt-5">Payment Method</h2>
            <div className="payment-methods">
              <div
                className={`payment-method ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  className="payment-method-radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <div className="payment-method-content">
                  <div className="payment-method-title">Credit/Debit Card</div>
                  <div className="payment-method-description">Pay with Visa, Mastercard or other cards</div>
                </div>
                <FaCreditCard size={24} />
              </div>

              <div
                className={`payment-method ${paymentMethod === "mobile" ? "active" : ""}`}
                onClick={() => setPaymentMethod("mobile")}
              >
                <input
                  type="radio"
                  id="mobile"
                  name="paymentMethod"
                  className="payment-method-radio"
                  checked={paymentMethod === "mobile"}
                  onChange={() => setPaymentMethod("mobile")}
                />
                <div className="payment-method-content">
                  <div className="payment-method-title">Mobile Money</div>
                  <div className="payment-method-description">Pay with MTN Mobile Money or Airtel Money</div>
                </div>
                <FaMobileAlt size={24} />
              </div>

              <div
                className={`payment-method ${paymentMethod === "cash" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cash")}
              >
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  className="payment-method-radio"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                <div className="payment-method-content">
                  <div className="payment-method-title">Cash on Delivery</div>
                  <div className="payment-method-description">Pay when you receive your order</div>
                </div>
                <FaMoneyBillWave size={24} />
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="mt-4">
                <div className="form-group">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cardName" className="form-label">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    className="form-input"
                    value={formData.cardName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="expiryDate" className="form-label">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      className="form-input"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      className="form-input"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-group mt-5">
              <button type="submit" className="btn btn-primary w-full">
                Place Order
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-summary">
          <h2 className="mb-4">Order Summary</h2>

          {cartItems.map((item) => (
            <div className="checkout-item" key={item.id}>
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="checkout-item-image" />
              <div className="checkout-item-content">
                <h4 className="checkout-item-title">{item.name}</h4>
                <div className="checkout-item-price">
                  RWF {item.price.toLocaleString()} x {item.quantity}
                </div>
              </div>
            </div>
          ))}

          <div className="checkout-total">
            <div className="checkout-row">
              <span>Subtotal</span>
              <span>RWF {subtotal.toLocaleString()}</span>
            </div>
            <div className="checkout-row">
              <span>Delivery Fee</span>
              <span>RWF {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="checkout-row">
              <span>Tax (18%)</span>
              <span>RWF {tax.toLocaleString()}</span>
            </div>
            <div className="checkout-row total">
              <span>Total</span>
              <span>RWF {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

