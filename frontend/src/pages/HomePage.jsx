// HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">


      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Bloggy!</h1>
          <p>Discover, Create, and Share Blogs with ease!</p>
          <button className="create-post-btn">Create a Post</button>
        </div>
        <div className="carousel">
          <img src="/images/hero1.jpg" alt="Hero 1" className="carousel-img" />
          <img src="/images/hero2.jpg" alt="Hero 2" className="carousel-img" />
          <img src="/images/hero3.jpg" alt="Hero 3" className="carousel-img" />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>Choose the Perfect Design</h2>
          <p>
            Create a blog that matches your style with flexible layouts and unlimited
            creativity at your fingertips. Bloggy provides the ultimate platform for
            crafting unique, creative, and original posts.
          </p>
        </div>
        <div className="about-bg"></div>
      </section>

      {/* User Analytics Section */}
      <section className="analytics-section">
        <div className="analytics-content">
          <h2>Analyze Your Audience</h2>
          <p>
            Discover which posts resonate with your audience using Bloggy's analytics.
            See where your audience comes from, what interests them, and which posts are
            trending.
          </p>
        </div>
        <div className="analytics-bg"></div>
      </section>

      
    </div>
  );
};

export default HomePage;
