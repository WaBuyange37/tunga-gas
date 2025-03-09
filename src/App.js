import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import SuppliersPage from './pages/SuppliersPage';
import TrackingPage from './pages/TrackingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);

  const login = (email, password) => {
    // In a real app, this would validate credentials with a backend
    if (email === 'admin@tungagas.com' && password === 'admin123') {
      setIsAuthenticated(true);
      setIsAdmin(true);
      return true;
    } else if (email && password) {
      setIsAuthenticated(true);
      setIsAdmin(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, quantity) => {
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: quantity } 
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          isAdmin={isAdmin} 
          logout={logout} 
          cartItemsCount={cart.reduce((total, item) => total + item.quantity, 0)}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage addToCart={addToCart} />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/" /> : 
                <LoginPage login={login} />
              } 
            />
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? 
                <Navigate to="/" /> : 
                <SignupPage setIsAuthenticated={setIsAuthenticated} />
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CheckoutPage 
                    cart={cart} 
                    removeFromCart={removeFromCart}
                    updateCartItemQuantity={updateCartItemQuantity}
                    clearCart={clearCart}
                  />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated && isAdmin}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
