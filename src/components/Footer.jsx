import { Link } from "react-router-dom"
import React from "react"
import { FaGasPump, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div>
          <div className="footer-logo">
            <FaGasPump />
            <span>TungaGas</span>
          </div>
          <p className="footer-description">
            Connecting gas suppliers and consumers in Rwanda with a reliable and efficient platform.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" className="footer-social-link" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div>
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/">Home</Link>
            </li>
            <li className="footer-link">
              <Link to="/shop">Shop</Link>
            </li>
            <li className="footer-link">
              <Link to="/suppliers">Suppliers</Link>
            </li>
            <li className="footer-link">
              <Link to="/tracking">Track Order</Link>
            </li>
            <li className="footer-link">
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Customer Service</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/contact">Contact Us</Link>
            </li>
            <li className="footer-link">
              <Link to="/faq">FAQ</Link>
            </li>
            <li className="footer-link">
              <Link to="/terms">Terms & Conditions</Link>
            </li>
            <li className="footer-link">
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li className="footer-link">
              <Link to="/returns">Returns & Refunds</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="footer-title">Newsletter</h3>
          <p className="footer-description">Subscribe to our newsletter to get updates on our latest offers.</p>
          <div className="footer-newsletter">
            <form className="footer-newsletter-form">
              <input type="email" className="footer-newsletter-input" placeholder="Enter your email" required />
              <button type="submit" className="footer-newsletter-button">
                <FaEnvelope />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} TungaGas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

