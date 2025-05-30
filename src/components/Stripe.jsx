import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("................"); // Replace with your actual Stripe publishable key

const cardLogos = (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
        <img src="/visa.png" alt="Visa" style={{ height: 32 }} />
        <img src="/mastercard.svg" alt="Mastercard" style={{ height: 32 }} />
    </div>
);

const elementStyle = {
    base: {
        fontSize: "18px",
        color: "#222",
        letterSpacing: "0.5px",
        padding: "14px 16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        fontFamily: "inherit",
        '::placeholder': {
            color: "#bbb",
        },
    },
    invalid: {
        color: "#e53e3e",
    },
};

function StripeCardForm({ amount, userInfo }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    // Editable shipping info
    const [shipping, setShipping] = useState({
        name: userInfo?.name || "",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "",
        address: userInfo?.address || "",
        city: userInfo?.city || "",
        zipCode: userInfo?.zipCode || "",
    });

    // Edit state for each field
    const [editing, setEditing] = useState({
        name: false,
        email: false,
        phone: false,
        address: false,
        city: false,
        zipCode: false,
    });

    const [shippingConfirmed, setShippingConfirmed] = useState(false);

    const handleInput = (e) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const handleEdit = (field) => setEditing({ ...editing, [field]: true });
    const handleSave = (field) => setEditing({ ...editing, [field]: false });

    const handleConfirmShipping = () => setShippingConfirmed(true);
    const handleChangeShipping = () => setShippingConfirmed(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit clicked", { stripe, elements, shippingConfirmed });
        if (!shippingConfirmed) {
            setResult({ error: "Please confirm your shipping information before paying." });
            return;
        }
        if (!stripe || !elements) {
            console.error("Stripe.js has not loaded yet.");
            setResult({ error: "Payment system not ready. Please wait and try again." });
            return;
        }
        setProcessing(true);
        setResult(null);

        try {
            // 1. Create PaymentIntent on backend
            const res = await fetch("http://localhost:4242/stripe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Math.round(amount),
                    currency: "RWF",
                }),
            });
            const { clientSecret, error: backendError } = await res.json();
            if (backendError) {
                console.error("Backend error:", backendError);
                setResult({ error: backendError });
                setProcessing(false);
                return;
            }

            // 2. Confirm payment
            const cardNumberElement = elements.getElement(CardNumberElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        name: shipping.name,
                        email: shipping.email,
                        phone: shipping.phone,
                        address: {
                            line1: shipping.address,
                            city: shipping.city,
                            postal_code: shipping.zipCode,
                        },
                    },
                },
                shipping: {
                    name: shipping.name,
                    phone: shipping.phone,
                    address: {
                        line1: shipping.address,
                        city: shipping.city,
                        postal_code: shipping.zipCode,
                    },
                },
            });

            console.log("Stripe result:", { error, paymentIntent });

            setProcessing(false);
            if (error) {
                setResult({ error: error.message });
            } else {
                setResult({ success: `Payment successful! ID: ${paymentIntent.id}` });
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setResult({ error: "Unexpected error occurred." });
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            maxWidth: 520,
            width: "100%",
            margin: "2rem auto",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            padding: 32
        }}>
            <div style={{ marginBottom: 24, fontWeight: 600, fontSize: 18 }}>
                <span>Amount to Pay: </span>
                <span style={{ color: "#ff6b35" }}>RWF {amount}</span>
            </div>
            {/* Shipping info fields with edit/save */}
            <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 16 }}>Shipping Information</div>
            {["name", "email", "phone", "address", "city", "zipCode"].map((field) => (
                <div className="form-group" style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }} key={field}>
                    <label className="form-label" style={{ flex: "0 0 90px", textTransform: "capitalize" }}>
                        {field === "zipCode" ? "Zip Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        className="form-input"
                        value={shipping[field]}
                        onChange={handleInput}
                        disabled={!editing[field] || shippingConfirmed}
                        required
                        style={{ flex: 1, padding: "10px", borderRadius: 6, border: "1px solid #ccc" }}
                    />
                    {!shippingConfirmed && (!editing[field] ? (
                        <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={() => handleEdit(field)}>Change</button>
                    ) : (
                        <button type="button" className="btn btn-primary" style={{ marginLeft: 8 }} onClick={() => handleSave(field)}>Save</button>
                    ))}
                </div>
            ))}
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {!shippingConfirmed ? (
                    <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginRight: 8, minWidth: 220 }}
                        onClick={handleConfirmShipping}
                    >
                        Confirm Shipping Info
                    </button>
                ) : (
                    <>
                        <span style={{ color: "#22c55e", fontWeight: 600 }}>Shipping info confirmed</span>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ marginLeft: 16 }}
                            onClick={handleChangeShipping}
                        >
                            Change
                        </button>
                    </>
                )}
            </div>
            {cardLogos}
            <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>Card Number</label>
                <CardNumberElement options={{ style: elementStyle }} />
                <hr />
            </div>
            <div className="form-group" style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>Expiry</label>
                    <CardExpiryElement options={{ style: elementStyle }} />
                    <hr />
                </div>
                <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontWeight: 600, marginBottom: 6, display: "block" }}>CVC</label>
                    <CardCvcElement options={{ style: elementStyle }} />
                    <hr />
                </div>
            </div>
            {/* Show message if shipping not confirmed */}
            {!shippingConfirmed && (
                <div style={{
                    color: "#e53e3e",
                    fontWeight: 500,
                    textAlign: "center",
                    marginBottom: 16
                }}>
                    Please confirm your shipping information before paying.
                </div>
            )}
            <button
                type="submit"
                disabled={processing || !shippingConfirmed}
                className="btn btn-primary"
                style={{
                    width: "100%",
                    padding: "14px 0",
                    fontWeight: 600,
                    fontSize: 18,
                    borderRadius: 8,
                    background: "#ff6b35",
                    color: "#fff",
                    border: "none",
                    cursor: processing || !shippingConfirmed ? "not-allowed" : "pointer",
                    opacity: !shippingConfirmed ? 0.6 : 1,
                    marginTop: 8
                }}
            >
                {processing ? "Processing..." : "Pay"}
            </button>
            {result && (
                <div style={{
                    marginTop: 24,
                    color: result.error ? "#e53e3e" : "#22c55e",
                    fontWeight: 600,
                    fontSize: 16,
                    textAlign: "center"
                }}>
                    {result.error || result.success}
                </div>
            )}
        </form>
    );
}

export default function StripeTest({ amount = 100, userInfo = {} }) {
    return (
        <Elements stripe={stripePromise}>
            <h2 style={{ textAlign: "center", marginTop: 32 }}>Stripe Card Payment</h2>
            <StripeCardForm amount={amount} userInfo={userInfo} />
        </Elements>
    );
}