import './index.css'
import React from 'react';

const NotFound = () => (
  <div className="notFound-container">
    <img
      className="notFound-image"
      alt="not found"
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
    />
    <h1 className="white">Page Not Found</h1>
    <p>We are sorry, the page you requested could not be found</p>
  </div>
)

export default NotFound
