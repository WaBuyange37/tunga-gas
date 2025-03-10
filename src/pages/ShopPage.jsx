"use client"

import React,{ useState, useEffect } from "react"
import {
  FaStar,
  FaStarHalfAlt,
  FaShoppingCart,
  FaHeart,
  FaFilter,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
} from "react-icons/fa"
import "./ShopPage.css"

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [priceRange, setPriceRange] = useState(50000)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const productsPerPage = 6

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedWishlist = localStorage.getItem("wishlist")

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Error parsing cart data:", e)
      }
    }

    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (e) {
        console.error("Error parsing wishlist data:", e)
      }
    }
  }, [])

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const categories = [
    { id: "all", name: "All Products" },
    { id: "cylinders", name: "Gas Cylinders" },
    { id: "stoves", name: "Gas Stoves" },
    { id: "accessories", name: "Accessories" },
    { id: "regulators", name: "Regulators" },
  ]

  const products = [
    {
      id: 1,
      name: "6kg Gas Cylinder",
      price: 12000,
      rating: 4.5,
      reviews: 24,
      image: "/images/akandi1.jpeg",
      category: "cylinders",
      description: "Perfect for small households and apartments.",
    },
    {
      id: 2,
      name: "12kg Gas Cylinder",
      price: 22000,
      rating: 5,
      reviews: 18,
      image: "/images/akandi2.jpeg",
      category: "cylinders",
      description: "Ideal for medium-sized families.",
    },
    {
      id: 3,
      name: "15kg Gas Cylinder",
      price: 28000,
      rating: 4,
      reviews: 12,
      image: "/images/akandi3.jpeg",
      category: "cylinders",
      description: "Best for large families and extended use.",
    },
    {
      id: 4,
      name: "Gas Stove - Single Burner",
      price: 15000,
      rating: 4.5,
      reviews: 32,
      image: "/images/akandi4.jpeg",
      category: "stoves",
      description: "Compact and efficient single burner stove.",
    },
    {
      id: 5,
      name: "Gas Stove - Double Burner",
      price: 25000,
      rating: 4.5,
      reviews: 16,
      image: "/images/akandi5.jpeg",
      category: "stoves",
      description: "Versatile double burner for cooking multiple dishes.",
    },
    {
      id: 6,
      name: "Gas Regulator",
      price: 5000,
      rating: 4,
      reviews: 42,
      image: "/images/ishyiga.jpeg",
      category: "regulators",
      description: "High-quality regulator for safe gas usage.",
    },
    {
      id: 7,
      name: "Gas Hose - 2m",
      price: 3000,
      rating: 4,
      reviews: 28,
      image: "/images/ishyiga1.jpeg",
      category: "accessories",
      description: "Durable 2-meter hose for connecting cylinder to stove.",
    },
    {
      id: 8,
      name: "Cylinder Trolley",
      price: 8000,
      rating: 4.5,
      reviews: 14,
      image: "/images/mai-gas.jpeg",
      category: "accessories",
      description: "Makes moving heavy cylinders easy and safe.",
    },
  ]

  // Add to cart function
  const addToCart = (product) => {
    if (product.outOfStock) return

    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      // If item already exists, increase quantity
      const updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      )
      setCartItems(updatedCart)
      showNotification(`Increased ${product.name} quantity in cart`)
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...product, quantity: 1 }])
      showNotification(`Added ${product.name} to cart`)
    }
  }

  // Toggle wishlist function
  const toggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some((item) => item.id === product.id)

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter((item) => item.id !== product.id)
      setWishlistItems(updatedWishlist)
      showNotification(`Removed ${product.name} from wishlist`, "info")
    } else {
      // Add to wishlist
      setWishlistItems([...wishlistItems, product])
      showNotification(`Added ${product.name} to wishlist`)
    }
  }

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId)
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

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

  const filteredProducts = products.filter((product) => {
    // Filter by category
    const categoryMatch = activeCategory === "all" || product.category === activeCategory

    // Filter by price
    const priceMatch = product.price <= priceRange

    // Filter by search query
    const searchMatch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && priceMatch && searchMatch
  })

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      window.scrollTo(0, 0)
    }
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="shop-page">
      {notification.show && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      <div className="shop-banner">
        <div className="container">
          <h1>Shop Gas Products</h1>
          <p>Quality gas cylinders and accessories for your home and business</p>

          <div className="shop-search">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </div>
            <button className="filter-toggle" onClick={toggleFilters}>
              <FaFilter /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          <aside className={`shop-sidebar ${showFilters ? "active" : ""}`}>
            <div className="filter-header">
              <h3>Filter Products</h3>
              <button className="close-filter" onClick={toggleFilters}>
                ×
              </button>
            </div>

            <div className="shop-filter">
              <h3 className="filter-title">
                <FaFilter /> Categories
              </h3>
              <ul className="category-list">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`category-button ${activeCategory === category.id ? "active" : ""}`}
                      onClick={() => {
                        setActiveCategory(category.id)
                        setCurrentPage(1)
                      }}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shop-filter">
              <h3 className="filter-title">Price Range</h3>
              <div className="price-filter">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="price-slider"
                />
                <div className="price-range-values">
                  <span>RWF 0</span>
                  <span>RWF {priceRange.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="shop-filter">
                <h3 className="filter-title">
                  <FaShoppingCart /> Cart Items
                </h3>
                <div className="cart-summary">
                  <p>{cartItems.reduce((total, item) => total + item.quantity, 0)} items in cart</p>
                  <p className="cart-total">
                    Total: RWF{" "}
                    {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}
                  </p>
                  <button className="btn btn-primary w-full" onClick={() => (window.location.href = "/checkout")}>
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </aside>

          <main className="shop-main">
            <div className="shop-header">
              <div className="shop-results">
                Showing {currentProducts.length} of {filteredProducts.length} products
              </div>
              <div className="shop-sort-mobile">
                <span>Sort by:</span>
                <select>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>

            {currentProducts.length > 0 ? (
              <>
                <div className="products-grid">
                  {currentProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                      {product.featured && <div className="product-badge featured">Featured</div>}
                      {product.outOfStock && <div className="product-badge out-of-stock">Out of Stock</div>}

                      <div className="product-image-container">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                        <div className="product-actions">
                          <button
                            className={`product-action-btn ${isInWishlist(product.id) ? "active" : ""}`}
                            onClick={() => toggleWishlist(product)}
                            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <FaHeart />
                          </button>
                          {!product.outOfStock && (
                            <button
                              className={`product-action-btn ${isInCart(product.id) ? "active" : ""}`}
                              onClick={() => addToCart(product)}
                              aria-label={isInCart(product.id) ? "Already in cart" : "Add to cart"}
                            >
                              {isInCart(product.id) ? <FaCheck /> : <FaShoppingCart />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="product-content">
                        <div className="product-category">{product.category}</div>
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <div className="product-rating">
                          {renderRatingStars(product.rating)}
                          <span>({product.reviews})</span>
                        </div>
                        <div className="product-price">RWF {product.price.toLocaleString()}</div>
                        <button
                          className={`btn btn-primary w-full ${product.outOfStock ? "btn-disabled" : isInCart(product.id) ? "btn-success" : ""}`}
                          onClick={() => addToCart(product)}
                          disabled={product.outOfStock}
                        >
                          {product.outOfStock ? (
                            "Out of Stock"
                          ) : isInCart(product.id) ? (
                            <>
                              <FaCheck /> Added to Cart
                            </>
                          ) : (
                            "Add to Cart"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FaChevronLeft />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ShopPage

