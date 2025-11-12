import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-description">
          Welcome to Bloggy, a platform created by the Camp Half-Blood Organization. 
          This website is made to connect people and let them share their experiences and opinions. 
          Feel free to contact us for suggesting new features or improvements.
        </p>
        <div className="social-media">
          <button>Instagram</button>
          <button>Twitter</button>
          <button>Facebook</button>
        </div>
        <p>&copy; 2025 Bloggy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
