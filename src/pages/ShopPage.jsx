import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaShoppingCart, FaHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './ShopPage.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: '6kg Gas Cylinder',
        price: 12000,
        rating: 4.5,
        reviews: 24,
        image: '/placeholder.svg?height=300&width=300',
        category: 'cylinders',
        description: 'Perfect for small households and apartments. Lightweight and easy to handle.',
        inStock: true,
        featured: true
      },
      {
        id: 2,
        name: '12kg Gas Cylinder',
        price: 22000,
        rating: 5,
        reviews: 18,
        image: '/placeholder.svg?height=300&width=300',
        category: 'cylinders',
        description: 'Ideal for medium-sized households. Our most popular size.',
        inStock: true,
        featured: true
      },
      {
        id: 3,
        name: '15kg Gas Cylinder',
        price: 28000,
        rating: 4,
        reviews: 12,
        image: '/placeholder.svg?height=300&width=300',
        category: 'cylinders',
        description: 'Great for larger households with higher gas consumption needs.',
        inStock: true,
        featured: false
      },
      {
        id: 4,
        name: 'Gas Stove - Single Burner',
        price: 15000,
        rating: 4.5,
        reviews: 32,
        image: '/placeholder.svg?height=300&width=300',
        category: 'stoves',
        description: 'Compact and efficient single burner stove for basic cooking needs.',
        inStock: true,
        featured: true
      },
      {
        id: 5,
        name: 'Gas Stove - Double Burner',
        price: 25000,
        rating: 4.5,
        reviews: 28,
        image: '/placeholder.svg?height=300&width=300',
        category: 'stoves',
        description: 'Versatile double burner stove for cooking multiple dishes simultaneously.',
        inStock: true,
        featured: false
      },
      {
        id: 6,
        name: 'Gas Regulator - Standard',
        price: 5000,
        rating: 4,
        reviews: 45,
        image: '/placeholder.svg?height=300&width=300',
        category: 'accessories',
        description: 'Standard regulator for safe and controlled gas flow.',
        inStock: true,
        featured: false
      },
      {
        id: 7,
        name: 'Gas Hose - 1.5m',
        price: 3000,
        rating: 4,
        reviews: 36,
        image: '/placeholder.svg?height=300&width=300',
        category: 'accessories',
        description: 'High-quality gas hose for connecting cylinders to appliances.',
        inStock: true,
        featured: false
      },
      {
        id: 8,
        name: 'Gas Leak Detector',
        price: 8000,
        rating: 5,
        reviews: 22,
        image: '/placeholder.svg?height=300&width=300',
        category: 'safety',
        description: 'Essential safety device to detect gas leaks in your home.',
        inStock: true,
        featured: true
      },
      {
        id: 9,
        name: '20kg Gas Cylinder',
        price: 35000,
        rating: 4.5,
        reviews: 15,
        image: '/placeholder.svg?height=300&width=300',
        category: 'cylinders',
        description: 'Heavy-duty cylinder for commercial use or large households.',
        inStock: false,
        featured: false
      },
      {
        id: 10,
        name: 'Gas Stove - Four Burner',
        price: 45000,
        rating: 5,
        reviews: 8,
        image: '/placeholder.svg?height=300&width=300',
        category: 'stoves',
        description: 'Professional-grade four burner stove for serious cooking enthusiasts.',
        inStock: true,
        featured: true
      },
      {
        id: 11,
        name: 'Cylinder Trolley',
        price: 12000,
        rating: 4,
        reviews: 19,
        image: '/images/ga2.jpeg',
        category: 'accessories',
        description: 'Make moving heavy gas cylinders easy with this sturdy trolley.',
        inStock: true,
        featured: false
      },
      {
        id: 12,
        name: 'Gas Safety Valve',
        price: 6000,
        rating: 4.5,
        reviews: 27,
        image: '/placeholder.svg?height=300&width=300',
        category: 'safety',
        description: 'Automatically cuts off gas flow in case of leaks or emergencies.',
        inStock: true,
        featured: false
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);

    // Extract unique categories
    const uniqueCategories = [...new Set(mockProducts.map(product => product.category))];
    setCategories(uniqueCategories);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, priceRange, sortBy, searchQuery, products]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Render rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" />);
    }

    return stars;
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle price range change
  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Toggle mobile filter
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="container">
          <h1>Shop Gas Products</h1>
          <p>Browse our wide selection of gas cylinders, stoves, and accessories</p>
          
          <div className="shop-search">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="filter-toggle" onClick={toggleFilter}>
              <FaFilter /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="shop-content">
          <aside className={`shop-sidebar ${isFilterOpen ? 'open' : ''}`}>
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="close-filter" onClick={toggleFilter}>×</button>
            </div>
            
            <div className="filter-section">
              <h4>Categories</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                  />
                  <span>All Products</span>
                </label>
                {categories.map(category => (
                  <label key={category} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                    />
                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <div className="price-input">
                  <label>Min:</label>
                  <input
                    type="number"
                    min="0"
                    max={priceRange.max}
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, 'min')}
                  />
                </div>
                <div className="price-input">
                  <label>Max:</label>
                  <input
                    type="number"
                    min={priceRange.min}
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, 'max')}
                  />
                </div>
              </div>
              <div className="price-slider">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  className="slider"
                />
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  className="slider"
                />
              </div>
            </div>
            
            <div className="filter-section">
              <h4>Sort By</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'featured'}
                    onChange={() => setSortBy('featured')}
                  />
                  <span>Featured</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'price-low'}
                    onChange={() => setSortBy('price-low')}
                  />
                  <span>Price: Low to High</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'price-high'}
                    onChange={() => setSortBy('price-high')}
                  />
                  <span>Price: High to Low</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === 'rating'}
                    onChange={() => setSortBy('rating')}
                  />
                  <span>Highest Rated</span>
                </label>
              </div>
            </div>
            
            <button 
              className="btn btn-primary w-full" 
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange({ min: 0, max: 50000 });
                setSortBy('featured');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </aside>
          
          <div className="shop-main">
            <div className="shop-results-header">
              <p>Showing {currentProducts.length} of {filteredProducts.length} products</p>
              <div className="shop-sort-mobile">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            {currentProducts.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="product-grid">
                {currentProducts.map(product => (
                  <div className="product-card" key={product.id}>
                    {product.featured && <span className="product-badge featured">Featured</span>}
                    {!product.inStock && <span className="product-badge out-of-stock">Out of Stock</span>}
                    
                    <div className="product-image-container">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
                      <button className="wishlist-button">
                        <FaHeart />
                      </button>
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
                      
                      <div className="product-actions">
                        <button 
                          className={`btn ${product.inStock ? 'btn-primary' : 'btn-disabled'}`}
                          disabled={!product.inStock}
                        >
                          <FaShoppingCart /> {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <div className="pagination-numbers">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button 
                  className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
