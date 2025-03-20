"use client"

import React,{ useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { initializePayment } from "../../services/paymentService"
import { FaCreditCard, FaMobileAlt, FaMoneyBillWave } from "react-icons/fa"
import "./Checkout.css"

const CheckoutForm = () => {
  const { user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    district: "",
    paymentMethod: "card",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Calculate order totals
  const subtotal = cartTotal
  const deliveryFee = 2000 // Fixed delivery fee
  const tax = subtotal * 0.18 // 18% VAT
  const total = subtotal + deliveryFee + tax

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        firstName: user.fullName?.split(" ")[0] || "",
        lastName: user.fullName?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        province: user.location?.province || "",
        district: user.location?.district || "",
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName) newErrors.firstName = "First name is required"
    if (!formData.lastName) newErrors.lastName = "Last name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.phone) newErrors.phone = "Phone number is required"
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.province) newErrors.province = "Province is required"
    if (!formData.district) newErrors.district = "District is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Prepare payment data
      const paymentData = {
        amount: total,
        userId: user.uid,
        items: cart,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          province: formData.province,
          district: formData.district,
        },
      }

      // Initialize payment
      await initializePayment(
        paymentData,
        (orderId) => {
          // On successful payment
          clearCart()
          navigate(`/order-confirmation/${orderId}`)
        },
        () => {
          // On payment modal close
          setIsLoading(false)
        },
      )
    } catch (error) {
      console.error("Payment error:", error)
      setIsLoading(false)
      alert("Payment failed. Please try again.")
    }
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
                {errors.firstName && <div className="form-error">{errors.firstName}</div>}
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
                {errors.lastName && <div className="form-error">{errors.lastName}</div>}
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
                {errors.email && <div className="form-error">{errors.email}</div>}
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
                {errors.phone && <div className="form-error">{errors.phone}</div>}
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
              {errors.address && <div className="form-error">{errors.address}</div>}
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
                {errors.city && <div className="form-error">{errors.city}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="province" className="form-label">
                  Province
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  className="form-input"
                  value={formData.province}
                  onChange={handleChange}
                  required
                />
                {errors.province && <div className="form-error">{errors.province}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="district" className="form-label">
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  className="form-input"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
                {errors.district && <div className="form-error">{errors.district}</div>}
              </div>
            </div>

            <h2 className="mb-4 mt-5">Payment Method</h2>
            <div className="payment-methods">
              <div
                className={`payment-method ${formData.paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, paymentMethod: "card" })}
              >
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  className="payment-method-radio"
                  checked={formData.paymentMethod === "card"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "card" })}
                />
                <div className="payment-method-content">
                  <div className="payment-method-title">Credit/Debit Card</div>
                  <div className="payment-method-description">Pay with Visa, Mastercard or other cards</div>
                </div>
                <FaCreditCard size={24} />
              </div>

              <div
                className={`payment-method ${formData.paymentMethod === "mobile" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, paymentMethod: "mobile" })}
              >
                <input
                  type="radio"
                  id="mobile"
                  name="paymentMethod"
                  className="payment-method-radio"
                  checked={formData.paymentMethod === "mobile"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "mobile" })}
                />
                <div className="payment-method-content">
                  <div className="payment-method-title">Mobile Money</div>
                  <div className="payment-method-description">Pay with MTN Mobile Money or Airtel Money</div>
                </div>
                <FaMobileAlt size={24} />
              </div>

              <div
                className={`payment-method ${formData.paymentMethod === "cash" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, paymentMethod: "cash" })}
              >
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  className="payment-method-radio"
                  checked={formData.paymentMethod === "cash"}
                  onChange={() => setFormData({ ...formData, paymentMethod: "cash" })}
                />
                <div className="payment-method-content">
                  <div className="payment-method-title">Cash on Delivery</div>
                  <div className="payment-method-description">Pay when you receive your order</div>
                </div>
                <FaMoneyBillWave size={24} />
              </div>
            </div>

            <div className="form-group mt-5">
              <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>

        <div className="checkout-summary">
          <h2 className="mb-4">Order Summary</h2>

          {cart.map((item) => (
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

export default CheckoutForm

