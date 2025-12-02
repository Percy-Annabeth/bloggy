import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import API_BASE_URL from "../utils/APIBaseUrl";
import "./LoginSignupPage.css";

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const endpoint = isLogin ? "login" : "signup";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(
        `${API_BASE_URL}/users/${endpoint}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      const { data } = response;

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage({ 
        type: "success", 
        text: data.message || "Success! Redirecting..." 
      });

      setTimeout(() => {
        if (isLogin) {
          navigate("/profile");
          window.location.reload();
        } else {
          setFormData({ name: "", email: "", password: "" });
          setIsLogin(true);
          setMessage({ 
            type: "success", 
            text: "Account created! Please login." 
          });
        }
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "An error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>

      <div className="auth-container">
        <div className="auth-content">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <h1 className="brand-title">Bloggy</h1>
            <p className="brand-subtitle">
              Share your stories, connect with readers, and inspire the world
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✍️</span>
                <span>Rich content editor</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌍</span>
                <span>Global community</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track your impact</span>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
              <p>
                {isLogin 
                  ? "Enter your credentials to access your account" 
                  : "Join our community of passionate writers"
                }
              </p>
            </div>

            {message.text && (
              <div className={`auth-message auth-message-${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">
                    <FaUser />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaLock />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {!isLogin && (
                  <span className="form-hint">
                    Must be at least 8 characters
                  </span>
                )}
              </div>

              {isLogin && (
                <div className="form-extras">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn btn-primary btn-lg auth-submit-btn"
              >
                {isSubmitting 
                  ? "Please wait..." 
                  : isLogin ? "Sign In" : "Create Account"
                }
              </button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: "", email: "", password: "" });
                  setMessage({ type: "", text: "" });
                }}
              >
                {isLogin 
                  ? "Create New Account" 
                  : "Already have an account? Sign In"
                }
              </button>
            </div>

            <p className="auth-terms">
              By continuing, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;