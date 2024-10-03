import React, { useState } from "react";
import "./App.css";
import Hero from "./component/hero/Hero";
import Contact from "./component/contact/Contact";
import InfiniteScrollImages from "./component/scroll/Scroll";
import { Navbar, Footer } from "./component/navbar/NavbarFooter";
import TOS from "./component/TermsOfService/TOS";
import PP from "./component/PrivacyPolicy/PP";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
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
    </div>
  );
}

export default App;
