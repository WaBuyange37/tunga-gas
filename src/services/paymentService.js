// This service integrates with Flutterwave for payment processing
import { createOrder } from "./orderService"

// Flutterwave public key
const FLUTTERWAVE_PUBLIC_KEY = process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY

// Initialize payment with Flutterwave
export const initializePayment = async (paymentData, onSuccess, onClose) => {
  try {
    // Make sure FlutterwaveCheckout is available
    if (typeof window.FlutterwaveCheckout !== "function") {
      throw new Error("Flutterwave SDK not loaded")
    }

    const config = {
      public_key: FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: Date.now().toString(),
      amount: paymentData.amount,
      currency: "RWF",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: paymentData.customer.email,
        phone_number: paymentData.customer.phone,
        name: paymentData.customer.name,
      },
      customizations: {
        title: "TungaGas Payment",
        description: "Payment for gas products",
        logo: "https://tungagas.com/logo.png",
      },
      callback: async (response) => {
        // Payment was successful
        if (response.status === "successful") {
          // Create order in database
          const orderId = await createOrder({
            userId: paymentData.userId,
            items: paymentData.items,
            total: paymentData.amount,
            shippingAddress: paymentData.shippingAddress,
            paymentDetails: {
              transactionId: response.transaction_id,
              paymentMethod: response.payment_type,
              status: "completed",
            },
          })

          // Call success callback with order ID
          if (onSuccess) onSuccess(orderId, response)
        } else {
          throw new Error("Payment was not successful")
        }
      },
      onclose: () => {
        // Call close callback
        if (onClose) onClose()
      },
    }

    // Initialize Flutterwave checkout
    const flutterwaveCheckout = new window.FlutterwaveCheckout(config)
    flutterwaveCheckout.open()

    return true
  } catch (error) {
    throw error
  }
}

// Verify payment (server-side)
export const verifyPayment = async (transactionId) => {
  // This would typically be done on the server side
  // For now, we'll just return true
  return true
}

