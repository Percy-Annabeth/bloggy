import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../utils/APIBaseUrl';
import PostCard from '../components/PostCard';
import './HomePage.css';

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts?limit=6`);
        setFeaturedPosts(response.data.data.slice(0, 3));
        setTrendingPosts(response.data.data.slice(3, 6));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Share Your Story<br />
              <span className="hero-subtitle">With The World</span>
            </h1>
            <p className="hero-description">
              Discover amazing stories, connect with passionate writers, 
              and share your unique perspective with a global community.
            </p>
            <div className="hero-actions">
              <Link to="/create-post" className="btn btn-primary btn-lg">
                Start Writing
              </Link>
              <Link to="/discover" className="btn btn-outline btn-lg">
                Explore Posts
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Stories</h2>
            <Link to="/discover" className="section-link">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="posts-grid">
              {featuredPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Bloggy?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✍️</div>
              <h3 className="feature-title">Rich Content Editor</h3>
              <p className="feature-description">
                Create beautiful posts with text, images, and videos. 
                Express yourself with our intuitive editor.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3 className="feature-title">Dark Mode</h3>
              <p className="feature-description">
                Easy on the eyes, perfect for late-night reading and writing sessions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Community</h3>
              <p className="feature-description">
                Connect with like-minded writers and readers from around the world.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Responsive Design</h3>
              <p className="feature-description">
                Perfect experience on any device - desktop, tablet, or mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Posts */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Now</h2>
            <Link to="/discover?sort=trending" className="section-link">
              More Trending →
            </Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="posts-grid">
              {trendingPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-description">
              Join thousands of writers sharing their stories on Bloggy
            </p>
            <Link to="/auth" className="btn btn-primary btn-lg">
              Get Started - It's Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;