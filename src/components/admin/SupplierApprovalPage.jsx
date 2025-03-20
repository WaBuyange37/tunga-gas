"use client"

import React,{ useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore"
import { db } from "../../config/firebase"
import { FaCheck, FaTimes, FaEye, FaDownload } from "react-icons/fa"
import "./AdminPages.css"

const SupplierApprovalPage = () => {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("userType", "==", "supplier"))
        const querySnapshot = await getDocs(q)

        const suppliersData = []
        querySnapshot.forEach((doc) => {
          suppliersData.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        setSuppliers(suppliersData)
      } catch (error) {
        console.error("Error fetching suppliers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [])

  const handleApprove = async (supplierId) => {
    try {
      const supplierRef = doc(db, "users", supplierId)
      await updateDoc(supplierRef, {
        "business.status": "approved",
      })

      // Update local state
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === supplierId
            ? { ...supplier, business: { ...supplier.business, status: "approved" } }
            : supplier,
        ),
      )

      showNotification("Supplier approved successfully", "success")
    } catch (error) {
      console.error("Error approving supplier:", error)
      showNotification("Failed to approve supplier", "error")
    }
  }

  const handleReject = async (supplierId) => {
    try {
      const supplierRef = doc(db, "users", supplierId)
      await updateDoc(supplierRef, {
        "business.status": "rejected",
      })

      // Update local state
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === supplierId
            ? { ...supplier, business: { ...supplier.business, status: "rejected" } }
            : supplier,
        ),
      )

      showNotification("Supplier rejected", "info")
    } catch (error) {
      console.error("Error rejecting supplier:", error)
      showNotification("Failed to reject supplier", "error")
    }
  }

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const viewSupplierDetails = (supplier) => {
    setSelectedSupplier(supplier)
  }

  const closeSupplierDetails = () => {
    setSelectedSupplier(null)
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading suppliers...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {notification.show && <div className={`admin-notification ${notification.type}`}>{notification.message}</div>}

      <div className="admin-header">
        <h1>Supplier Approval</h1>
        <p>Review and approve supplier applications</p>
      </div>

      {suppliers.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Owner</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.business?.name || "N/A"}</td>
                  <td>{supplier.fullName}</td>
                  <td>
                    {supplier.location?.province}, {supplier.location?.district}
                  </td>
                  <td>
                    <span className={`status-badge ${supplier.business?.status || "pending"}`}>
                      {supplier.business?.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-action-btn view-btn"
                        onClick={() => viewSupplierDetails(supplier)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>

                      {(supplier.business?.status === "pending" || !supplier.business?.status) && (
                        <>
                          <button
                            className="admin-action-btn approve-btn"
                            onClick={() => handleApprove(supplier.id)}
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="admin-action-btn reject-btn"
                            onClick={() => handleReject(supplier.id)}
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty-state">
          <h3>No supplier applications found</h3>
          <p>There are currently no suppliers waiting for approval</p>
        </div>
      )}

      {selectedSupplier && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>Supplier Details</h2>
              <button className="admin-modal-close" onClick={closeSupplierDetails}>
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="supplier-details">
                <div className="supplier-detail-group">
                  <h3>Business Information</h3>
                  <div className="supplier-detail-row">
                    <span className="detail-label">Business Name:</span>
                    <span className="detail-value">{selectedSupplier.business?.name || "N/A"}</span>
                  </div>
                  <div className="supplier-detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{selectedSupplier.business?.description || "N/A"}</span>
                  </div>
                  <div className="supplier-detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${selectedSupplier.business?.status || "pending"}`}>
                      {selectedSupplier.business?.status || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="supplier-detail-group">
                  <h3>Owner Information</h3>
                  <div className="supplier-detail-row">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{selectedSupplier.fullName}</span>
                  </div>
                  <div className="supplier-detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedSupplier.email}</span>
                  </div>
                  <div className="supplier-detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedSupplier.phone}</span>
                  </div>
                </div>

                <div className="supplier-detail-group">
                  <h3>Location</h3>
                  <div className="supplier-detail-row">
                    <span className="detail-label">Province:</span>
                    <span className="detail-value">{selectedSupplier.location?.province}</span>
                  </div>
                  <div className="supplier-detail-row">
                    <span className="detail-label">District:</span>
                    <span className="detail-value">{selectedSupplier.location?.district}</span>
                  </div>
                  <div className="supplier-detail-row">
                    <span className="detail-label">Sector/Town:</span>
                    <span className="detail-value">{selectedSupplier.location?.sector}</span>
                  </div>
                </div>

                <div className="supplier-detail-group">
                  <h3>RDB Certificate</h3>
                  <div className="certificate-actions">
                    <button className="btn btn-primary">
                      <FaEye /> View Certificate
                    </button>
                    <button className="btn btn-outline">
                      <FaDownload /> Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              {(selectedSupplier.business?.status === "pending" || !selectedSupplier.business?.status) && (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      handleApprove(selectedSupplier.id)
                      closeSupplierDetails()
                    }}
                  >
                    <FaCheck /> Approve Supplier
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleReject(selectedSupplier.id)
                      closeSupplierDetails()
                    }}
                  >
                    <FaTimes /> Reject Supplier
                  </button>
                </>
              )}
              <button className="btn btn-outline" onClick={closeSupplierDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupplierApprovalPage

