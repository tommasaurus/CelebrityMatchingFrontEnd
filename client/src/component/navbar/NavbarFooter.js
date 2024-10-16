import React from "react";
import { Link } from "react-router-dom";
import "./NavbarFooter.css";

export const Navbar = () => {
  const handleHowItWorksClick = () => {
    const scrollPosition = window.innerHeight * 0.7;
    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-button">
          <img
            src={"/OFlogo.png"}
            alt="Celebrity Finder Logo"
            className="logo-image"
          />
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/scroll" className="nav-button how-it-works">
          Gallery
        </Link>
        <button className="nav-button sign-in">Sign in</button>
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <Link to="/" className="logo-button">
            <img
              src={"/OFlogo.png"}
              alt="Celebrity Finder Logo"
              className="logo-image"
            />
          </Link>
        </div>
        <div className="footer-sections">
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li>
                <Link to="/" className="footer-button">
                  Finder
                </Link>
              </li>
              <li>
                <Link to="/scroll" className="footer-button">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/privacy-policy" className="footer-button">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="footer-button">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Get in touch</h4>
            <ul>
              <li>
                <Link to="/contact" className="footer-button">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <hr className="footer-line" />
        <p className="copyright">
          &copy; 2024 OnlyFaceFinder. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
