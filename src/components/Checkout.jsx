"use client"


import React, { useState} from "react"
import { FaCreditCard, FaMobileAlt, FaMoneyBillWave, FaInfoCircle, FaUniversity, FaGoogle, FaApple } from "react-icons/fa"
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3"
import "./Checkout.css"
import StripeCardForm from "./Stripe"

const Checkout = ({
  cart = [],
  // eslint-disable-next-line
  removeFromCart,
  // eslint-disable-next-line
  updateCartItemQuantity,
  // eslint-disable-next-line
  clearCart,
  shippingInfo = {
    firstName: "John",
    lastName: "Doe",
    address: "Kigali, Rwanda",
    phone: "0780000000",
    email: "john@example.com",
    city: "Kigali",
    zipCode: "00000",
  },
  onChangeShipping,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    mobileNumber: "",
    fullname: "",
    email: "",
    phone_number: "",
  })
  const [infoOpen, setInfoOpen] = useState(null)
  const [shippingConfirmed, setShippingConfirmed] = useState(false)
  const [showAllMethods, setShowAllMethods] = useState(true)
  // eslint-disable-next-line
  const [editingName, setEditingName] = useState(false)
  // eslint-disable-next-line
  const [editingEmail, setEditingEmail] = useState(false)
  const [editingPhone, setEditingPhone] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null) // null | "success" | "error"
  const [orderMessage, setOrderMessage] = useState("")
  // eslint-disable-next-line
  const [flutterwaveConfig, setFlutterwaveConfig] = useState({
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: 0, // will update before payment
    currency: "RWF",
    payment_options: "card,mobilemoneyrwanda", // default, will update
    customer: {
      email: "",
      phone_number: "",
      name: "",
    },
    customizations: {
      title: "TungaGas Payment",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  })

  const cartItems = cart

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = 2000
  const tax = subtotal * 0.18
  const total = subtotal + deliveryFee + tax

  // Payment provider info (update as needed)
  const paymentProviders = {
    mobile: {
      name: "Flutterwave",
      logo: <img src="/flutterwave.svg" alt="Flutterwave" style={{ height: 20, verticalAlign: "middle" }} />,
      info: "Mobile Money payments are processed via MTN and Airtel Money through Flutterwave.",
      networks: [
        <img key="mtn" src="/mtn-momo.png" alt="MTN" style={{ height: 24, marginLeft: 8 }} />,
        <img key="airtel" src="/airtel-money.png" alt="Airtel" style={{ height: 24, marginLeft: 8 }} />,
      ],
    },
    card: {
      name: "Stripe",
      logo: <img src='/stripe.png' alt="Stripe" style={{ height: 20, verticalAlign: "middle" }} />,
      info: "Card payments are securely processed by Stripe.",
      networks: [
        <img key="visa" src="/visa.png" alt="Visa" style={{ height: 24, marginLeft: 8 }} />,
        <img key="mastercard" src="/mastercard.svg" alt="Mastercard" style={{ height: 24, marginLeft: 8 }} />,
      ],
    },
    cash: {
      name: "TungaGas",
      logo: null,
      info: "Cash on Delivery is collected directly by TungaGas.",
      networks: [],
    },
    bank: {
      name: "",
      logo: null,
      info: "Bank transfer will support BK, Equity, and more.",
      networks: [
        <img key="bk" src="/BK.png" alt="BK" style={{ height: 24, marginLeft: 8 }} />,
        <img key="equity" src="/equity.png" alt="Equity" style={{ height: 24, marginLeft: 8 }} />,
      ],
    },
    googlepay: {
      name: "",
      logo: null,
      info: "Google Pay will be supported soon.",
      networks: [
        <img key="googlepay" src="/GooglePay.png" alt="Google Pay" style={{ height: 24, marginLeft: 8 }} />,
      ],
    },
    applepay: {
      name: "",
      logo: null,
      info: "Apple Pay will be supported soon.",
      networks: [
        <img key="applepay" src="/ApplePay.png" alt="Apple Pay" style={{ height: 24, marginLeft: 8 }} />,
      ],
    },
    crypto: {
      name: "Binance Pay",
      logo: <img src="/binancepay.svg" alt="Binance Pay" style={{ height: 20, verticalAlign: "middle" }} />,
      info: "Crypto payments will support BTC, ETH, BNB, USDT and more via Binance Pay.",
      networks: [
        <img key="btc" src="/btc.svg" alt="BTC" style={{ height: 24, marginLeft: 8 }} />,
        <img key="eth" src="/eth.svg" alt="ETH" style={{ height: 24, marginLeft: 8 }} />,
        <img key="bnb" src="/bnb.svg" alt="BNB" style={{ height: 24, marginLeft: 8 }} />,
        <img key="usdt" src="/usdt.svg" alt="USDT" style={{ height: 24, marginLeft: 8 }} />,
      ],
    },
  }

  // Flutterwave config per method
  let getFlutterwaveConfig = () => {
    if (paymentMethod === "mobile") {
      return {
        ...flutterwaveConfig,
        amount: total,
        payment_options: "mobilemoneyrwanda",
        customer: {
          ...flutterwaveConfig.customer,
          email: formData.email || shippingInfo.email,
          phone_number: formData.mobileNumber || shippingInfo.phone,
          name: formData.fullname || `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
        },
      }
    }
    if (paymentMethod === "card") {
      return {
        ...flutterwaveConfig,
        amount: total,
        payment_options: "card",
        customer: {
          ...flutterwaveConfig.customer,
          email: formData.email || shippingInfo.email,
          phone_number: formData.phone_number || shippingInfo.phone,
          name: formData.fullname || `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
        },
      }
    }
    return flutterwaveConfig
  }

  // This hook must be called at the top level!
  let handleFlutterPayment = useFlutterwave(getFlutterwaveConfig())

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!shippingConfirmed) {
      setOrderStatus("error")
      setOrderMessage("Please confirm or change your shipping information before placing your order.")
      return
    }

    setProcessing(true)
    setOrderStatus(null)
    setOrderMessage("")

    // Only run Flutterwave for mobile money
    if (paymentMethod === "mobile") {
      const config = {
        ...flutterwaveConfig,
        amount: total,
        payment_options: "mobilemoneyrwanda",
        customer: {
          ...flutterwaveConfig.customer,
          email: formData.email || shippingInfo.email,
          phone_number: formData.mobileNumber || shippingInfo.phone,
          name: formData.fullname || `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
        }

      }

      handleFlutterPayment({
        ...config,
        callback: (response) => {
          setProcessing(false)
          closePaymentModal()
          if (response.status === "successful" || response.status === "success") {
            setOrderStatus("success")
            setOrderMessage("Order placed successfully! Thank you for your payment.")
          } else {
            setOrderStatus("error")
            setOrderMessage("Payment failed or was cancelled. Please try again.")
          }
        },
        onClose: () => {
          setProcessing(false)
          if (!orderStatus) {
            setOrderStatus("error")
            setOrderMessage("Payment was not completed or was cancelled. Please try again.")
          }
        },
      })
      return
    }

    
    if (paymentMethod === "cash") {
      setProcessing(false)
      setOrderStatus("success")
      setOrderMessage("Order placed! Please pay on delivery.")
      // Optionally clearCart()
      return
    }

    setProcessing(false)
    setOrderStatus("error")
    setOrderMessage("This payment method is not yet supported.")
  }

  const paymentMethods = [
    {
      key: "mobile",
      icon: <FaMobileAlt size={24} />,
      title: "Mobile Money",
      desc: "Pay with MTN Mobile Money or Airtel Money",
      enabled: true,
    },
    {
      key: "card",
      icon: <FaCreditCard size={24} />,
      title: "Credit/Debit Card",
      desc: "Pay with Visa, Mastercard or other cards",
      enabled: true,
    },
    {
      key: "cash",
      icon: <FaMoneyBillWave size={24} />,
      title: "Cash on Delivery",
      desc: "Pay when you receive your order",
      enabled: true,
    },
    {
      key: "bank",
      icon: <FaUniversity size={24} />,
      title: "Bank Transfer",
      desc: "Pay directly from your bank account",
      enabled: false, // Coming soon
    },
    {
      key: "googlepay",
      icon: <FaGoogle size={24} />,
      title: "Google Pay",
      desc: "Pay with Google Pay",
      enabled: false, // Coming soon
    },
    {
      key: "applepay",
      icon: <FaApple size={24} />,
      title: "Apple Pay",
      desc: "Pay with Apple Pay",
      enabled: false, // Coming soon
    },
    {
      key: "crypto",
      icon: <img src="/binancepay.svg" alt="Binance Pay" style={{ height: 24 }} />,
      title: "Crypto (Binance Pay)",
      desc: "Pay with BTC, ETH, BNB, USDT and more",
      enabled: false, // Coming soon
    },
  ]

  // Add state for cash shipping confirmation
  // eslint-disable-next-line
  const [cashShippingConfirmed, setCashShippingConfirmed] = useState(false);

  // Add state for cash info editing
  // eslint-disable-next-line
  const [cashEditing, setCashEditing] = useState(false);

  // Add state for cash info (copy from shippingInfo)
  const [cashInfo, setCashInfo] = useState({ ...shippingInfo });

  // Handler for cash info change
  // eslint-disable-next-line
  const handleCashInfoChange = (e) => {
    setCashInfo({ ...cashInfo, [e.target.name]: e.target.value });
  };

  // Handler for placing cash order
  // eslint-disable-next-line
  const handleCashOrder = (e) => {
    e.preventDefault();
    if (!cashShippingConfirmed) return;
    setOrderStatus("success");
    setOrderMessage("Order placed! Our team will contact you for delivery and payment.");
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-form">
          <h2 className="mb-4 mt-5">Payment Method</h2>
          {/* Step 1: Show all methods if not chosen */}
          {showAllMethods ? (
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <div
                  key={method.key}
                  className={`payment-method${!method.enabled ? " disabled" : ""}`}
                  style={{
                    position: "relative",
                    cursor: method.enabled ? "pointer" : "not-allowed",
                    opacity: method.enabled ? 1 : 0.5,
                  }}
                  onClick={() => {
                    if (method.enabled) {
                      setPaymentMethod(method.key)
                      setShowAllMethods(false)
                    }
                  }}
                >
                  <div className="payment-method-content" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {method.icon}
                    <div>
                      <div className="payment-method-title">{method.title}</div>
                      <div className="payment-method-description">{method.desc}</div>
                      {method.enabled && paymentProviders[method.key] && (
                        <div style={{ display: "flex", alignItems: "center", marginTop: 4, position: "relative" }}>
                          <span style={{ fontSize: 12, color: "#888" }}>
                            Powered by {/*paymentProviders[method.key].name*/}
                          </span>
                          {paymentProviders[method.key].logo}
                          <FaInfoCircle
                            style={{ marginLeft: 6, cursor: "pointer", color: "#888" }}
                            onClick={e => {
                              e.stopPropagation()
                              setInfoOpen(infoOpen === method.key ? null : method.key)
                            }}
                          />
                          {infoOpen === method.key && (
                            <div className="payment-info-tooltip" style={{
                              marginLeft: 10,
                            }}>
                            {paymentProviders[method.key].info}
                            </div>
                          )}
                        </div>
                      )}
                      {!method.enabled && (
                        <span style={{
                          fontSize: 12,
                          color: "#ff6b35", // Orange used on your site
                          fontWeight: 600,
                          marginTop: 4,
                          display: "inline-block"
                        }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                  {method.enabled && paymentProviders[method.key] && paymentProviders[method.key].networks.length > 0 && (
                    <div style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      display: "flex",
                      gap: 4,
                    }}>
                      {paymentProviders[method.key].networks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Step 2: Show only the chosen method and its form
            <>
              <div className="payment-method active" style={{ position: "relative" }}>
                <div className="payment-method-content">
                  <div className="payment-method-title">{paymentMethods.find(m => m.key === paymentMethod).title}</div>
                  <div className="payment-method-description">{paymentMethods.find(m => m.key === paymentMethod).desc}</div>
                  <div style={{ display: "flex", alignItems: "center", marginTop: 4, position: "relative" }}>
                    <span style={{ fontSize: 12, color: "#888" }}>
                      Powered by {paymentProviders[paymentMethod].name}
                    </span>
                    {paymentProviders[paymentMethod].logo}
                    <FaInfoCircle
                      style={{ marginLeft: 6, cursor: "pointer", color: "#888" }}
                      onClick={e => {
                        e.stopPropagation()
                        setInfoOpen(infoOpen === paymentMethod ? null : paymentMethod)
                      }}
                    />
                    {infoOpen === paymentMethod && (
                      <div className="payment-info-tooltip">
                        {paymentProviders[paymentMethod].info}
                      </div>
                    )}
                  </div>
                </div>
                {paymentProviders[paymentMethod].networks.length > 0 && (
                  <div style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    display: "flex",
                    gap: 4,
                  }}>
                    {paymentProviders[paymentMethod].networks}
                  </div>
                )}
                {paymentMethods.find(m => m.key === paymentMethod).icon}
              </div>
              <button
                className="btn btn-outline"
                style={{ margin: "1rem 0" }}
                onClick={() => {
                  setShowAllMethods(true)
                  setPaymentMethod("")
                }}
              >
                Change payment method
              </button>

              {/* Step 3: Show the form for the chosen method */}
              
                {paymentMethod === "card" && (
                  <>
                    {/* StripeCardForm now handles shipping info confirmation and payment */}
                    <StripeCardForm
                      amount={total}
                      userInfo={{
                        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                        email: shippingInfo.email,
                        phone: shippingInfo.phone,
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        zipCode: shippingInfo.zipCode,
                      }}
                    />
                    {/* No Place Order button or shipping confirmation here for card */}
                  </>
                )}
                <form onSubmit={handleSubmit}>
                {paymentMethod === "mobile" && (
                  <div className="mt-4">
                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <label htmlFor="mobileNumber" className="form-label" style={{ flex: "0 0 180px" }}>
                        Mobile Money Number:
                      </label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        className="form-input"
                        placeholder="Enter your mobile money number"
                        value={formData.mobileNumber || shippingInfo.phone}
                        onChange={handleChange}
                        disabled={!editingPhone}
                        required
                        style={{ flex: 1 }}
                      />
                      {!editingPhone ? (
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ marginLeft: 8, whiteSpace: "nowrap" }}
                          onClick={() => setEditingPhone(true)}
                        >
                          Change
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ marginLeft: 8, whiteSpace: "nowrap" }}
                          onClick={() => setEditingPhone(false)}
                        >
                          Save
                        </button>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="mobileAmount" className="form-label">
                        Amount to Pay
                      </label>
                      <input
                        type="number"
                        id="mobileAmount"
                        name="mobileAmount"
                        className="form-input"
                        value={total}
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Shipping confirmation blocker and Place Order button only for non-card methods */}
                {paymentMethod !== "card" && (
                  <>
                    <div style={{ marginTop: 24 }}>
                      <div className="shipping-summary" style={{ fontWeight: 500 }}>
                        Shipping to: {shippingInfo.firstName} {shippingInfo.lastName}, {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.zipCode} | {shippingInfo.phone}
                        <div style={{ marginTop: 8 }}>
                          {!shippingConfirmed ? (
                            <>
                              <button
                                className="btn btn-primary"
                                style={{ marginRight: 8 }}
                                type="button"
                                onClick={() => setShippingConfirmed(true)}
                              >
                                Confirm Shipping Info
                              </button>
                              <button
                                className="btn btn-outline"
                                type="button"
                                onClick={() => {
                                  if (onChangeShipping) {
                                    onChangeShipping()
                                  } else {
                                    window.location.href = "/profile"
                                  }
                                }}
                              >
                                Change
                              </button>
                            </>
                          ) : (
                            <span style={{ color: "#22c55e", fontWeight: 600 }}>Shipping info confirmed</span>
                          )}
                        </div>
                      </div>
                      {!shippingConfirmed && (
                        <div style={{ color: "#e53e3e", marginBottom: 16 }}>
                          Please confirm your shipping information before proceeding to payment.
                        </div>
                      )}
                    </div>

                    {/* Place Order button only for non-card methods */}
                    <div className="form-group mt-5">
                      <button
                        type="submit"
                        className={`btn btn-primary w-full${!shippingConfirmed ? " btn-disabled" : ""}`}
                        disabled={!shippingConfirmed || processing}
                        style={{
                          opacity: !shippingConfirmed ? 0.6 : 1,
                          cursor: !shippingConfirmed ? "not-allowed" : "pointer",
                          position: "relative",
                          transition: "opacity 0.2s"
                        }}
                      >
                        {processing ? (
                          <span>
                            <span className="spinner" style={{
                              display: "inline-block",
                              width: 20,
                              height: 20,
                              border: "3px solid #fff",
                              borderTop: "3px solid #ff6b35",
                              borderRadius: "50%",
                              animation: "spin 1s linear infinite",
                              marginRight: 8,
                              verticalAlign: "middle"
                            }} />
                            Processing...
                          </span>
                        ) : (
                          "Place Order"
                        )}
                      </button>
                      {/* Show warning if not confirmed and tried to submit */}
                      {orderStatus === "error" && orderMessage && (
                        <div style={{ color: "#e53e3e", marginTop: 12, fontWeight: 500 }}>
                          {orderMessage}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </form>
            </>
          )}
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

      {/* Optionally, show a pop-up for order placed */}
      {(orderStatus === "success" || orderStatus === "error") && orderMessage && (
        <div className="order-popup" style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          border: orderStatus === "success" ? "2px solid #22c55e" : "2px solid #e53e3e",
          borderRadius: 8,
          padding: "2rem 2.5rem",
          zIndex: 9999,
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          color: orderStatus === "success" ? "#22c55e" : "#e53e3e",
          fontWeight: 600,
          fontSize: "1.2rem",
          textAlign: "center"
        }}>
          {orderMessage}
          <div>
            <button
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={() => setOrderStatus(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .btn-disabled {
          pointer-events: none;
        }
        `}
      </style>
    </div>
  )
}

export default Checkout