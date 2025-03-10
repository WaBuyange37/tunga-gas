import React from "react"
import HomeBanner from "../components/HomeBanner"
import B2CSection from "../components/B2CSection"
import B2BSection from "../components/B2BSection"
import { FaGasPump, FaShippingFast, FaUserShield, FaHeadset } from "react-icons/fa"
import "./HomePage.css"

const HomePage = ({ addToCart }) => {
  const features = [
    {
      icon: <FaGasPump size={24} />,
      title: "Quality Gas",
      description: "We provide high-quality gas products for all your needs.",
    },
    {
      icon: <FaShippingFast size={24} />,
      title: "Fast Delivery",
      description: "Get your gas delivered quickly to your doorstep.",
    },
    {
      icon: <FaUserShield size={24} />,
      title: "Secure Transactions",
      description: "Your payments and personal information are always secure.",
    },
    {
      icon: <FaHeadset size={24} />,
      title: "24/7 Support",
      description: "Our customer support team is always available to help you.",
    },
  ]

  return (
    <div className="home-page">
      <HomeBanner />

      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2>Why Choose TungaGas?</h2>
            <p>We provide the best gas solutions for homes and businesses in Rwanda</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <B2CSection addToCart={addToCart} />
      <B2BSection />
    </div>
  )
}

export default HomePage

