import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../config/firebase"

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    throw error
  }
}

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, "orders", orderId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    } else {
      return null
    }
  } catch (error) {
    throw error
  }
}

// Get orders by user ID
export const getOrdersByUserId = async (userId) => {
  try {
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const orders = []
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return orders
  } catch (error) {
    throw error
  }
}

// Get orders for a supplier
export const getOrdersBySupplier = async (supplierId) => {
  try {
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const orders = []
    querySnapshot.forEach((doc) => {
      const orderData = doc.data()

      // Check if any item in the order belongs to this supplier
      const hasSupplierItems = orderData.items.some((item) => item.supplierId === supplierId)

      if (hasSupplierItems) {
        // Filter items to only include those from this supplier
        const supplierItems = orderData.items.filter((item) => item.supplierId === supplierId)

        orders.push({
          id: doc.id,
          ...orderData,
          items: supplierItems,
        })
      }
    })

    return orders
  } catch (error) {
    throw error
  }
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, "orders", orderId)
    await updateDoc(orderRef, {
      status: status,
      updatedAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    throw error
  }
}

// Get all orders (admin only)
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, "orders")
    const q = query(ordersRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const orders = []
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return orders
  } catch (error) {
    throw error
  }
}

