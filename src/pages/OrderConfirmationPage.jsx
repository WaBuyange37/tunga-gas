"use client"

import React,{ useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getOrderById } from "../services/orderService"
import { FaCheckCircle, FaBox, FaTruck, FaMapMarkerAlt } from "react-icons/fa"

const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId)
        setOrder(orderData)
      } catch (err) {
        setError("Failed to load order details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || "Order not found"}</p>
          <Link to="/shop" className="text-primary hover:underline mt-2 inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. Your order has been received and is being processed.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{orderId.substring(0, 8)}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "processing"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center mb-4">
              <FaBox className="text-gray-500 mr-2" />
              <span className="font-medium">Order Details</span>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">RWF {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>RWF {(order.total * 0.85).toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery</span>
                <span>RWF 2,000</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (18%)</span>
                <span>RWF {(order.total * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>RWF {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaTruck className="text-gray-500 mr-2" />
            <span className="font-medium">Delivery Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Address</h3>
              <p className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mr-1 mt-1 flex-shrink-0" />
                <span>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}
                  <br />
                  {order.shippingAddress?.province}, {order.shippingAddress?.district}
                </span>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
              <p>Within 24-48 hours</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage

