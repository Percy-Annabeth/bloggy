import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FaSearch } from "react-icons/fa"; // Importing Font Awesome search icon

const Header = () => {
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsToken(!!token); // Converts token to boolean
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-logo">Bloggy</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/discover">Discover</Link>
        <Link to="/create-post">Create Post</Link>
        <Link to="/contact-us">Contact Us</Link>
      </div>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
        <FaSearch className="search-icon" />
      </div>
      <div className="navbar-auth">
        {isToken ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/auth">Login / Signup</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
