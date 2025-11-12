import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";
import { useNavigate } from 'react-router-dom'; 
import "./LoginSignupPage.css";

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [name, setName] = useState(""); // For signup only
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "login" : "signup";
      const payload = isLogin ? { email, password } : { name, email, password }; // Include name for signup
      
      const response = await axios.post(`${API_BASE_URL}/users/${endpoint}`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      
      const { data } = response;
      if (data.token){ localStorage.setItem("token", data.token); }      
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage(data.message);
      
      if (isLogin) {
        navigate("/profile"); // Redirect immediately after login
        window.location.reload();
      } else {
        setName(""); // Clear name if signing up
      }
      setEmail("");
      setPassword("");
    } 
    catch (error) {
      setMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-toggle">
          {isLogin ? "New here?" : "Already have an account?"} {" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignupPage;
