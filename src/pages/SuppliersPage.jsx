"use client"

import React,{ useState } from "react"
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaSearch, FaFilter } from "react-icons/fa"
import "./SuppliersPage.css"

const SuppliersPage = () => {
  const [activeRegion, setActiveRegion] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const regions = [
    { id: "all", name: "All Regions" },
    { id: "kigali", name: "Kigali" },
    { id: "eastern", name: "Eastern Province" },
    { id: "western", name: "Western Province" },
    { id: "northern", name: "Northern Province" },
    { id: "southern", name: "Southern Province" },
  ]

  const suppliers = [
    {
      id: 1,
      name: "Kigali Gas Suppliers Ltd",
      logo: "/placeholder.svg?height=100&width=100",
      description: "Leading gas supplier in Kigali with over 15 years of experience.",
      rating: 4.8,
      reviews: 124,
      region: "kigali",
      address: "KK 123 St, Kigali",
      phone: "+250 788 123 456",
      email: "info@kigaligas.com",
      website: "www.kigaligas.com",
      products: ["6kg Cylinders", "12kg Cylinders", "15kg Cylinders", "Gas Stoves"],
    },
    {
      id: 2,
      name: "Eastern Gas Company",
      logo: "/placeholder.svg?height=100&width=100",
      description: "Reliable gas supplier serving the Eastern Province with quality products.",
      rating: 4.5,
      reviews: 86,
      region: "eastern",
      address: "Kayonza District, Eastern Province",
      phone: "+250 788 234 567",
      email: "info@easterngas.com",
      website: "www.easterngas.com",
      products: ["6kg Cylinders", "12kg Cylinders", "Gas Regulators"],
    },
    {
      id: 3,
      name: "Western Gas Distributors",
      logo: "/placeholder.svg?height=100&width=100",
      description: "Trusted gas distributor in the Western Province with fast delivery services.",
      rating: 4.3,
      reviews: 72,
      region: "western",
      address: "Rubavu District, Western Province",
      phone: "+250 788 345 678",
      email: "info@westerngas.com",
      website: "www.westerngas.com",
      products: ["12kg Cylinders", "15kg Cylinders", "Industrial Gas"],
    },
    {
      id: 4,
      name: "Northern Gas Solutions",
      logo: "/placeholder.svg?height=100&width=100",
      description: "Comprehensive gas solutions for homes and businesses in Northern Province.",
      rating: 4.6,
      reviews: 58,
      region: "northern",
      address: "Musanze District, Northern Province",
      phone: "+250 788 456 789",
      email: "info@northerngas.com",
      website: "www.northerngas.com",
      products: ["6kg Cylinders", "12kg Cylinders", "Gas Stoves", "Accessories"],
    },
    {
      id: 5,
      name: "Southern Gas Enterprises",
      logo: "/placeholder.svg?height=100&width=100",
      description: "Family-owned gas supplier serving the Southern Province since 2005.",
      rating: 4.7,
      reviews: 94,
      region: "southern",
      address: "Huye District, Southern Province",
      phone: "+250 788 567 890",
      email: "info@southerngas.com",
      website: "www.southerngas.com",
      products: ["6kg Cylinders", "12kg Cylinders", "15kg Cylinders", "Commercial Gas"],
    },
    {
      id: 6,
      name: "Rwanda Gas Corporation",
      logo: "/placeholder.svg?height=100&width=100",
      description: "National gas supplier with distribution centers across Rwanda.",
      rating: 4.9,
      reviews: 156,
      region: "kigali",
      address: "KG 567 St, Kigali",
      phone: "+250 788 678 901",
      email: "info@rwandagas.com",
      website: "www.rwandagas.com",
      products: ["All Cylinder Sizes", "Commercial Gas", "Industrial Gas", "Gas Equipment"],
    },
  ]

  const renderRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />)
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half-star" className="half-star" />)
    }

    return stars
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    // Filter by region
    const regionMatch = activeRegion === "all" || supplier.region === activeRegion

    // Filter by search query
    const searchMatch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchQuery.toLowerCase())

    return regionMatch && searchMatch
  })

  return (
    <div className="suppliers-page">
      <div className="suppliers-banner">
        <div className="container">
          <h1>Gas Suppliers in Rwanda</h1>
          <p>Find reliable gas suppliers near you</p>
        </div>
      </div>

      <div className="container">
        <div className="suppliers-layout">
          <aside className="suppliers-sidebar">
            <div className="suppliers-filter">
              <h3 className="filter-title">
                <FaFilter /> Regions
              </h3>
              <ul className="region-list">
                {regions.map((region) => (
                  <li key={region.id}>
                    <button
                      className={`region-button ${activeRegion === region.id ? "active" : ""}`}
                      onClick={() => setActiveRegion(region.id)}
                    >
                      {region.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="suppliers-main">
            <div className="suppliers-header">
              <div className="suppliers-search">
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <FaSearch className="search-icon" />
                </div>
              </div>
              <div className="suppliers-results">
                Showing {filteredSuppliers.length} of {suppliers.length} suppliers
              </div>
            </div>

            {filteredSuppliers.length > 0 ? (
              <div className="suppliers-grid">
                {filteredSuppliers.map((supplier) => (
                  <div className="supplier-card" key={supplier.id}>
                    <div className="supplier-header">
                      <img src={supplier.logo || "/placeholder.svg"} alt={supplier.name} className="supplier-logo" />
                      <div>
                        <h3 className="supplier-name">{supplier.name}</h3>
                        <div className="supplier-rating">
                          {renderRatingStars(supplier.rating)}
                          <span>
                            {supplier.rating} ({supplier.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="supplier-description">{supplier.description}</p>

                    <div className="supplier-products">
                      <h4>Products:</h4>
                      <div className="product-tags">
                        {supplier.products.map((product, index) => (
                          <span key={index} className="product-tag">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="supplier-contact">
                      <div className="contact-item">
                        <FaMapMarkerAlt />
                        <span>{supplier.address}</span>
                      </div>
                      <div className="contact-item">
                        <FaPhone />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="contact-item">
                        <FaEnvelope />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="contact-item">
                        <FaGlobe />
                        <span>{supplier.website}</span>
                      </div>
                    </div>

                    <div className="supplier-actions">
                      <button className="btn btn-primary">Contact Supplier</button>
                      <button className="btn btn-outline">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-suppliers">
                <h3>No suppliers found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default SuppliersPage

