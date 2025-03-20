"use client"

import React,{ useState } from "react"
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"
import "./AdminPages.css"

const AdminProductsPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "6kg Gas Cylinder",
      price: 12000,
      category: "cylinders",
      stock: 45,
      image: "/images/ga2.jpeg",
    },
    {
      id: 2,
      name: "12kg Gas Cylinder",
      price: 22000,
      category: "cylinders",
      stock: 32,
      image: "/images/ga3.jpeg",
    },
    {
      id: 3,
      name: "Gas Stove - Single Burner",
      price: 15000,
      category: "stoves",
      stock: 18,
      image: "/images/ga5.jpeg",
    },
  ])

  // Function to add a new product
  const addProduct = () => {
    // This would typically open a modal or form
    alert("Add product functionality would be implemented here")
  }

  // Function to edit a product
  const editProduct = (productId) => {
    // This would typically open a modal or form with the product data
    alert(`Edit product ${productId} functionality would be implemented here`)
  }

  // Function to delete a product
  const deleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== productId))
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <p>Add, edit, or remove products from your inventory</p>
      </div>

      <div className="admin-actions-bar">
        <button className="btn btn-primary" onClick={addProduct}>
          <FaPlus /> Add New Product
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="product-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=50&width=50"
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>RWF {product.price.toLocaleString()}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn view-btn" onClick={() => editProduct(product.id)}>
                      <FaEdit />
                    </button>
                    <button className="admin-action-btn reject-btn" onClick={() => deleteProduct(product.id)}>
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

export default AdminProductsPage

