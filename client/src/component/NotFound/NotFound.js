import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Optional: Create this file for custom styles if needed

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="back-home">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
