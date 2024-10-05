import React, { useState, useEffect } from "react";
import "./App.css";
import Hero from "./component/hero/Hero";
import Contact from "./component/contact/Contact";
import InfiniteScrollImages from "./component/scroll/Scroll";
import { Navbar, Footer } from "./component/navbar/NavbarFooter";
import TOS from "./component/TermsOfService/TOS";
import PP from "./component/PrivacyPolicy/PP";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    // Google Analytics Initialization
    if (window.gtag) {
      window.gtag('js', new Date());
      window.gtag('config', 'G-HHN4DE3TPL');
    }
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);

    // Google Analytics page tracking
    if (window.gtag) {
      window.gtag('config', 'G-HHN4DE3TPL', {
        page_path: `/${page}`,
        page_title: page.charAt(0).toUpperCase() + page.slice(1), // Capitalize page title
      });
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <Hero navigateTo={navigateTo} />;
      case "contact":
        return <Contact />;
      case "donate":
        return <Donate />;
      case "scroll":
        return <InfiniteScrollImages />;
      case "privacy-policy":
        return <PP />;
      case "terms-of-service":
        return <TOS />;
      default:
        return <Hero navigateTo={navigateTo} />;
    }
  };

  return (
    <div className='App'>
      <Navbar navigateTo={navigateTo} />
      <main>{renderCurrentPage()}</main>
      <Footer navigateTo={navigateTo} />
      <Analytics />
    </div>
  );
}

export default App;
