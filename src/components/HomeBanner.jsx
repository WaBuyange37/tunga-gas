import { Link } from "react-router-dom"
import "./HomeBanner.css"
import React from "react"

const HomeBanner = () => {
  return (
    <section className="home-banner">
      <div className="container">
        <div className="home-banner-content">
          <h1>Connecting Gas Suppliers and Consumers in Rwanda</h1>
          <p>
            TungaGas provides a reliable platform for ordering gas cylinders with fast delivery and competitive prices.
            Join thousands of satisfied customers today!
          </p>
          <div className="home-banner-buttons">
            <Link to="/shop" className="btn btn-outline k">
              Browse Products
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeBanner

