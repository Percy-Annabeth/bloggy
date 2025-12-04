// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginSignupPage from "./pages/LoginSignupPage.jsx";
import DiscoverPage from "./pages/DiscoverPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SinglePostPage from "./pages/SinglePostPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import VisitorProfilePage from "./pages/VisitorProfilePage.jsx";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginSignupPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/posts/:id" element={<SinglePostPage />} />
        <Route path="/visitorprofile/:userId" element={<VisitorProfilePage />} />
        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            localStorage.getItem("token") ? <ProfilePage /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/create-post"
          element={
            localStorage.getItem("token") ? <CreatePostPage /> : <Navigate to="/auth" />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
