// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "./Header.css";
// import { FaSearch } from "react-icons/fa"; // Importing Font Awesome search icon

// const Header = () => {
//   const [isToken, setIsToken] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsToken(!!token); // Converts token to boolean
//   }, []);

//   return (
//     <header className="navbar">
//       <div className="navbar-logo">Bloggy</div>
//       <div className="navbar-links">
//         <Link to="/">Home</Link>
//         <Link to="/discover">Discover</Link>
//         <Link to="/create-post">Create Post</Link>
//         <Link to="/contact-us">Contact Us</Link>
//       </div>
//       <div className="navbar-search">
//         <input type="text" placeholder="Search..." />
//         <FaSearch className="search-icon" />
//       </div>
//       <div className="navbar-auth">
//         {isToken ? (
//           <Link to="/profile">Profile</Link>
//         ) : (
//           <Link to="/auth">Login / Signup</Link>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;











import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [isToken, setIsToken] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsToken(!!token);
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-logo" onClick={closeMobileMenu}>
            <span className="logo-text">Bloggy</span>
          </Link>

          <nav className="header-nav desktop-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/discover" className="nav-link">Discover</Link>
            <Link to="/create-post" className="nav-link">Write</Link>
            <Link to="/contact-us" className="nav-link">Contact</Link>
          </nav>

          <div className="header-search desktop-search">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn" aria-label="Search">
              <FaSearch />
            </button>
          </div>

          <div className="header-actions">
            <button 
              className="theme-toggle" 
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {isToken ? (
              <Link to="/profile" className="btn btn-primary btn-sm">
                Profile
              </Link>
            ) : (
              <Link to="/auth" className="btn btn-outline btn-sm">
                Sign In
              </Link>
            )}

            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-search">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              <FaSearch />
            </button>
          </div>

          <nav className="mobile-nav">
            <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/discover" className="mobile-nav-link" onClick={closeMobileMenu}>
              Discover
            </Link>
            <Link to="/create-post" className="mobile-nav-link" onClick={closeMobileMenu}>
              Write
            </Link>
            <Link to="/contact-us" className="mobile-nav-link" onClick={closeMobileMenu}>
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;