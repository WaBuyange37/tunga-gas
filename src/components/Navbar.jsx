"use client";

import React, { useState, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaGasPump, FaBars, FaTimes, FaUser, FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // Placeholder for dynamic cart count

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <FaGasPump />
          <span>TungaGas</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? "nav-mobile open" : "nav-mobile"}`}>
          <button className="menu-button" onClick={toggleMenu} aria-label="Close Menu">
            <FaTimes />
          </button>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/shop" onClick={() => setIsMenuOpen(false)}>
                Shop
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/suppliers" onClick={() => setIsMenuOpen(false)}>
                Suppliers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tracking" onClick={() => setIsMenuOpen(false)}>
                Track Order
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                About Us
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <Link to="/account" className="btn btn-outline">
                <FaUser /> Account
              </Link>
              <Link to="/cart" className="btn btn-primary">
                <FaShoppingCart /> Cart ({cartItemCount})
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="menu-button" onClick={toggleMenu} aria-label="Open Menu">
          <FaBars />
        </button>
      </div>
    </header>
  );
};

export default Navbar;