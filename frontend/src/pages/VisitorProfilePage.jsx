import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaUsers, FaFileAlt, FaUserPlus, FaUserMinus } from "react-icons/fa";
import API_BASE_URL from "../utils/APIBaseUrl";
import PostCard from "../components/PostCard";
import "./VisitorProfilePage.css";

const VisitorProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isOwnProfile = currentUser._id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/users/visitorprofile/${userId}`
        );
        
        if (response.data.success) {
          setProfile(response.data.data);
          
          // Check if current user is subscribed
          if (currentUser._id && response.data.data.subscribers) {
            const subscribed = response.data.data.subscribers.some(
              sub => sub.toString() === currentUser._id || sub._id === currentUser._id
            );
            setIsSubscribed(subscribed);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser._id]);

  const handleSubscription = async () => {
    if (!token) {
      navigate("/auth");
      return;
    }

    setActionLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${userId}/subscribe`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setIsSubscribed(!isSubscribed);
        
        // Update subscriber count
        setProfile(prev => ({
          ...prev,
          subscribers: isSubscribed 
            ? prev.subscribers.filter(id => id !== currentUser._id)
            : [...prev.subscribers, currentUser._id]
        }));
      }
    } catch (err) {
      console.error("Error updating subscription:", err);
      alert("Failed to update subscription");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="visitor-profile-page">
        <div className="container">
          <div className="profile-skeleton">
            <div className="skeleton skeleton-cover"></div>
            <div className="skeleton skeleton-avatar"></div>
            <div className="skeleton skeleton-info"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="visitor-profile-page">
        <div className="container">
          <div className="error-message">
            <h2>{error || "Profile not found"}</h2>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to own profile
  if (isOwnProfile) {
    navigate("/profile");
    return null;
  }

  return (
    <div className="visitor-profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-cover-overlay"></div>
        </div>
        
        <div className="container profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {profile.profile_pic ? (
                <img src={profile.profile_pic} alt={profile.name} />
              ) : (
                <div className="avatar-placeholder">
                  <FaUser />
                </div>
              )}
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{profile.name}</h1>
              <div className="profile-stats-inline">
                <span>
                  <FaFileAlt />
                  {profile.posts?.length || 0} posts
                </span>
                <span>
                  <FaUsers />
                  {profile.subscribers?.length || 0} subscribers
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className={`btn ${isSubscribed ? 'btn-outline' : 'btn-primary'}`}
              onClick={handleSubscription}
              disabled={actionLoading}
            >
              {isSubscribed ? (
                <>
                  <FaUserMinus />
                  Unsubscribe
                </>
              ) : (
                <>
                  <FaUserPlus />
                  Subscribe
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container">
        <div className="profile-content">
          <h2 className="section-title">
            Posts by {profile.name} ({profile.posts?.length || 0})
          </h2>

          {profile.posts && profile.posts.length > 0 ? (
            <div className="posts-grid">
              {profile.posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No posts yet</h3>
              <p>{profile.name} hasn't published any posts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorProfilePage;