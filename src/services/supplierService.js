import { collection, doc, getDocs, getDoc, updateDoc, query, where, orderBy } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../config/firebase"

// Get all suppliers
export const getAllSuppliers = async () => {
  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("userType", "==", "supplier"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const suppliers = []
    querySnapshot.forEach((doc) => {
      suppliers.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return suppliers
  } catch (error) {
    throw error
  }
}

// Get approved suppliers
export const getApprovedSuppliers = async () => {
  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("userType", "==", "supplier"), where("business.status", "==", "approved"))
    const querySnapshot = await getDocs(q)

    const suppliers = []
    querySnapshot.forEach((doc) => {
      suppliers.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return suppliers
  } catch (error) {
    throw error
  }
}

// Get supplier by ID
export const getSupplierById = async (supplierId) => {
  try {
    const docRef = doc(db, "users", supplierId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists() && docSnap.data().userType === "supplier") {
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

// Update supplier approval status
export const updateSupplierStatus = async (supplierId, status) => {
  try {
    const supplierRef = doc(db, "users", supplierId)
    await updateDoc(supplierRef, {
      "business.status": status,
    })

    return true
  } catch (error) {
    throw error
  }
}

// Upload RDB certificate
export const uploadRDBCertificate = async (supplierId, file) => {
  try {
    const storageRef = ref(storage, `certificates/${supplierId}/${file.name}`)
    await uploadBytes(storageRef, file)
    const certificateUrl = await getDownloadURL(storageRef)

    // Update supplier document with certificate URL
    const supplierRef = doc(db, "users", supplierId)
    await updateDoc(supplierRef, {
      "business.certificateUrl": certificateUrl,
    })

    return certificateUrl
  } catch (error) {
    throw error
  }
}

