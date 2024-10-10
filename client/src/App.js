import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Hero from "./component/hero/Hero";
import Contact from "./component/contact/Contact";
import InfiniteScrollImages from "./component/scroll/Scroll";
import { Navbar, Footer } from "./component/navbar/NavbarFooter";
import TOS from "./component/TermsOfService/TOS";
import PP from "./component/PrivacyPolicy/PP";
import NotFound from "./component/NotFound/NotFound";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Analytics />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/scroll" element={<InfiniteScrollImages />} /> */}
            <Route path="/privacy-policy" element={<PP />} />
            <Route path="/terms-of-service" element={<TOS />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
          </Routes>
        </main>
        <Footer />
      </div>
      <GoogleAnalytics />
    </Router>
  );
}

// Component to handle Google Analytics tracking for page views
const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics page tracking
    if (window.gtag) {
      window.gtag("config", "G-HHN4DE3TPL", {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

export default App;
