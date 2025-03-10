import { Link } from "react-router-dom"
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaHeart } from "react-icons/fa"
import "./B2CSection.css"
import React from "react"

const B2CSection = () => {
  const products = [
    {
      id: 1,
      name: "6kg Gas Cylinder",
      price: 12000,
      rating: 4.5,
      reviews: 24,
      image: "/images/ga2.jpeg?height=200&width=300",
    },
    {
      id: 2,
      name: "12kg Gas Cylinder",
      price: 22000,
      rating: 5,
      reviews: 18,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "15kg Gas Cylinder",
      price: 28000,
      rating: 4,
      reviews: 12,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Gas Stove - Single Burner",
      price: 15000,
      rating: 4.5,
      reviews: 32,
      image: "/placeholder.svg?height=200&width=300",
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
      stars.push(<FaStarHalfAlt key="half-star" />)
    }

    return stars
  }

  return (
    <section className="b2c-section">
      <div className="container">
        <div className="b2c-header">
          <h2>Shop Gas Products</h2>
          <p>Quality gas cylinders and accessories for your home</p>
        </div>

        <div className="b2c-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
              <div className="product-content">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">RWF {product.price.toLocaleString()}</div>
                <div className="product-rating">
                  {renderRatingStars(product.rating)}
                  <span>({product.reviews})</span>
                </div>
                <div className="product-footer">
                  <button className="btn btn-primary">
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button className="btn btn-outline">
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/shop" className="btn btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default B2CSection

