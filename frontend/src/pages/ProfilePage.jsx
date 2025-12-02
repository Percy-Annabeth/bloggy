import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaEdit, 
  FaSignOutAlt,
  FaHeart,
  FaBookOpen,
  FaUsers,
  FaUserPlus,
  FaFileAlt
} from "react-icons/fa";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";
import PostCard from "../components/PostCard";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You are not logged in");
          navigate("/auth");
          return;
        }

        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setMessage("User not found");
          return;
        }

        const userData = JSON.parse(storedUser);
        const userId = userData._id;

        const response = await axios.get(
          `${API_BASE_URL}/users/profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setUser(response.data.data);
          setUserPosts(response.data.data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/posts/favourites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setFavoritePosts(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching favorite posts:", error);
      }
    };

    if (activeTab === "favorites") {
      fetchFavoritePosts();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDelete = (postId) => {
    setUserPosts(userPosts.filter(post => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="profile-page">
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

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-message">
            <h2>{message || "Profile not found"}</h2>
            <button className="btn btn-primary" onClick={() => navigate("/auth")}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-cover-overlay"></div>
        </div>
        
        <div className="container profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user.profile_pic ? (
                <img src={user.profile_pic} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  <FaUser />
                </div>
              )}
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{user.name}</h1>
              <div className="profile-email">
                <FaEnvelope />
                {user.email}
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-outline btn-sm">
              <FaEdit />
              Edit Profile
            </button>
            <button 
              className="btn btn-outline btn-sm logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container">
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FaFileAlt />
            </div>
            <div className="stat-info">
              <div className="stat-value">{userPosts.length}</div>
              <div className="stat-label">Posts</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaHeart />
            </div>
            <div className="stat-info">
              <div className="stat-value">{favoritePosts.length}</div>
              <div className="stat-label">Favorites</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-info">
              <div className="stat-value">{user.subscribers?.length || 0}</div>
              <div className="stat-label">Subscribers</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaUserPlus />
            </div>
            <div className="stat-info">
              <div className="stat-value">{user.subscribed?.length || 0}</div>
              <div className="stat-label">Following</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            <FaFileAlt />
            My Posts ({userPosts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            <FaHeart />
            Favorites ({favoritePosts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "reading" ? "active" : ""}`}
            onClick={() => setActiveTab("reading")}
          >
            <FaBookOpen />
            Reading List
          </button>
        </div>

        {/* Content */}
        <div className="profile-content">
          {activeTab === "posts" && (
            <>
              {userPosts.length > 0 ? (
                <div className="posts-grid">
                  {userPosts.map(post => (
                    <PostCard 
                      key={post._id} 
                      post={post} 
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No posts yet</h3>
                  <p>Start sharing your thoughts with the world</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/create-post")}
                  >
                    Create Your First Post
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "favorites" && (
            <>
              {favoritePosts.length > 0 ? (
                <div className="posts-grid">
                  {favoritePosts.map(post => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">❤️</div>
                  <h3>No favorite posts</h3>
                  <p>Save posts you love to read them later</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/discover")}
                  >
                    Explore Posts
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "reading" && (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>Reading list feature coming soon</h3>
              <p>Save articles to read later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;