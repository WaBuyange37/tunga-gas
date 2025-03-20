import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../config/firebase"

// Get all products
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const products = []
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return products
  } catch (error) {
    throw error
  }
}

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("category", "==", category), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const products = []
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return products
  } catch (error) {
    throw error
  }
}

// Get featured products
export const getFeaturedProducts = async (limitCount = 4) => {
  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("featured", "==", true), limit(limitCount))
    const querySnapshot = await getDocs(q)

    const products = []
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return products
  } catch (error) {
    throw error
  }
}

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, "products", productId)
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

// Add a new product
export const addProduct = async (productData, imageFile) => {
  try {
    let imageUrl = null

    // Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`)
      await uploadBytes(storageRef, imageFile)
      imageUrl = await getDownloadURL(storageRef)
    }

    // Add product to Firestore
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      imageUrl: imageUrl,
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    throw error
  }
}

// Update a product
export const updateProduct = async (productId, productData, imageFile) => {
  try {
    const productRef = doc(db, "products", productId)

    const updateData = { ...productData }

    // Upload new image if provided
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`)
      await uploadBytes(storageRef, imageFile)
      const imageUrl = await getDownloadURL(storageRef)
      updateData.imageUrl = imageUrl
    }

    updateData.updatedAt = serverTimestamp()

    await updateDoc(productRef, updateData)
    return true
  } catch (error) {
    throw error
  }
}

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, "products", productId))
    return true
  } catch (error) {
    throw error
  }
}

