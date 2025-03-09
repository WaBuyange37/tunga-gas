import React from "react"
import { Link } from "react-router-dom"
import { FaBuilding, FaWarehouse, FaIndustry, FaHotel, FaArrowRight } from "react-icons/fa"
import "./B2BSection.css"

const B2BSection = () => {
  const businessSolutions = [
    {
      icon: <FaBuilding size={24} />,
      title: "Office Buildings",
      description: "Reliable gas supply for office buildings with flexible delivery schedules and bulk discounts.",
      link: "/b2b/office-buildings",
    },
    {
      icon: <FaWarehouse size={24} />,
      title: "Warehouses & Storage",
      description: "High-capacity gas solutions for warehouses and storage facilities with safety compliance.",
      link: "/b2b/warehouses",
    },
    {
      icon: <FaIndustry size={24} />,
      title: "Manufacturing",
      description: "Industrial-grade gas supply for manufacturing processes with technical support.",
      link: "/b2b/manufacturing",
    },
    {
      icon: <FaHotel size={24} />,
      title: "Hotels & Restaurants",
      description: "Consistent gas supply for hospitality businesses with priority delivery service.",
      link: "/b2b/hospitality",
    },
  ]

  return (
    <section className="b2b-section">
      <div className="container">
        <div className="b2b-header">
          <h2>Business Solutions</h2>
          <p>Tailored gas supply solutions for businesses of all sizes</p>
        </div>

        <div className="b2b-content">
          {businessSolutions.map((solution, index) => (
            <div className="b2b-card" key={index}>
              <div className="b2b-card-header">
                <div className="b2b-card-icon">{solution.icon}</div>
                <h3 className="b2b-card-title">{solution.title}</h3>
              </div>
              <div className="b2b-card-content">
                <p>{solution.description}</p>
              </div>
              <div className="b2b-card-footer">
                <Link to={solution.link} className="btn btn-outline">
                  Learn More <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/b2b" className="btn btn-primary">
            Explore B2B Solutions
          </Link>
        </div>
      </div>
    </section>
  )
}

export default B2BSection

