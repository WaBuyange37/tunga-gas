"use client"

import React,{ useState } from "react"
import { FaEye, FaEnvelope, FaTrash, FaUserPlus } from "react-icons/fa"
import "./AdminPages.css"

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+250 788 123 456",
      location: {
        province: "Kigali City",
        district: "Gasabo",
      },
      orders: 5,
      joinedDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+250 788 234 567",
      location: {
        province: "Eastern Province",
        district: "Kayonza",
      },
      orders: 3,
      joinedDate: "2023-02-20",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "+250 788 345 678",
      location: {
        province: "Western Province",
        district: "Rubavu",
      },
      orders: 8,
      joinedDate: "2023-01-05",
    },
  ])

  // Function to view customer details
  const viewCustomerDetails = (customerId) => {
    const customer = customers.find((c) => c.id === customerId)
    alert(`View details for ${customer.name}`)
    // This would typically open a modal with customer details
  }

  // Function to send email to customer
  const sendEmailToCustomer = (customerId) => {
    const customer = customers.find((c) => c.id === customerId)
    alert(`Send email to ${customer.email}`)
    // This would typically open an email composition interface
  }

  // Function to add a new customer (placeholder)
  const addNewCustomer = () => {
    const newCustomer = {
      id: customers.length + 1,
      name: "New Customer",
      email: "new@example.com",
      phone: "+250 788 999 999",
      location: {
        province: "Kigali City",
        district: "Nyarugenge",
      },
      orders: 0,
      joinedDate: new Date().toISOString().split("T")[0],
    }

    setCustomers([...customers, newCustomer])
    alert("New customer added successfully!")
  }

  // Function to remove a customer
  const removeCustomer = (customerId) => {
    if (window.confirm("Are you sure you want to remove this customer?")) {
      setCustomers(customers.filter((customer) => customer.id !== customerId))
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Customer Management</h1>
        <p>View and manage customer accounts</p>
      </div>

      <div className="admin-actions-bar">
        <button className="btn btn-primary" onClick={addNewCustomer}>
          <FaUserPlus /> Add Test Customer
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  {customer.location.province}, {customer.location.district}
                </td>
                <td>{customer.orders}</td>
                <td>{customer.joinedDate}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-action-btn view-btn"
                      title="View Details"
                      onClick={() => viewCustomerDetails(customer.id)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="admin-action-btn"
                      title="Send Email"
                      onClick={() => sendEmailToCustomer(customer.id)}
                    >
                      <FaEnvelope />
                    </button>
                    <button
                      className="admin-action-btn reject-btn"
                      title="Remove Customer"
                      onClick={() => removeCustomer(customer.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminCustomersPage

