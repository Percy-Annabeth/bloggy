import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaHeart, 
  FaRegHeart, 
  FaThumbsDown, 
  FaRegThumbsDown,
  FaBookmark,
  FaRegBookmark,
  FaEye,
  FaClock,
  FaEdit,
  FaTrash,
  FaShare,
  FaComment
} from "react-icons/fa";
import API_BASE_URL from "../utils/APIBaseUrl";
import "./SinglePostPage.css";

const SinglePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isOwner = currentUser._id === post?.user?._id;

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
        setPost(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load post");
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Check if user has liked/disliked/favorited
  const hasLiked = post?.likes?.some(like => like.user === currentUser._id);
  const hasDisliked = post?.dislikes?.some(dislike => dislike.user === currentUser._id);
  const hasFavorited = post?.favourited_by?.some(fav => fav.user === currentUser._id);

  // Calculate reading time
  const calculateReadingTime = () => {
    if (!post?.content) return "1 min read";
    const text = post.content
      .filter(item => item.type === "text")
      .map(item => item.para || item.content?.para || "")
      .join(" ");
    const words = text.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Handle like
  const handleLike = async () => {
    if (!token) {
      navigate("/auth");
      return;
    }
    setActionLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response.data.data);
    } catch (error) {
      console.error("Error liking post:", error);
    }
    setActionLoading(false);
  };

  // Handle dislike
  const handleDislike = async () => {
    if (!token) {
      navigate("/auth");
      return;
    }
    setActionLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response.data.data);
    } catch (error) {
      console.error("Error disliking post:", error);
    }
    setActionLoading(false);
  };

  // Handle favorite
  const handleFavorite = async () => {
    if (!token) {
      navigate("/auth");
      return;
    }
    setActionLoading(true);
    try {
      const endpoint = hasFavorited ? "remfavourite" : "addfavourite";
      const response = await axios.put(
        `${API_BASE_URL}/posts/${id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response.data.data);
    } catch (error) {
      console.error("Error favoriting post:", error);
    }
    setActionLoading(false);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/discover");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="single-post-page">
        <div className="container">
          <div className="post-skeleton">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-meta"></div>
            <div className="skeleton skeleton-content"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="single-post-page">
        <div className="container">
          <div className="error-message">
            <h2>{error}</h2>
            <button className="btn btn-primary" onClick={() => navigate("/discover")}>
              Back to Discover
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="single-post-page">
      <article className="post-article">
        <div className="container post-container">
          {/* Post Header */}
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            
            <div className="post-meta">
              <div className="author-info">
                {post.user?.profile_pic && (
                  <img 
                    src={post.user.profile_pic} 
                    alt={post.user.name}
                    className="author-avatar"
                  />
                )}
                <div className="author-details">
                  <span 
                    className="author-name"
                    onClick={() => navigate(`/visitorprofile/${post.user._id}`)}
                  >
                    {post.user?.name || "Anonymous"}
                  </span>
                  <div className="post-info">
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="separator">•</span>
                    <span className="reading-time">
                      <FaClock />
                      {calculateReadingTime()}
                    </span>
                    <span className="separator">•</span>
                    <span className="views">
                      <FaEye />
                      {post.views || 0} views
                    </span>
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="owner-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => navigate(`/edit/${id}`)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={handleDelete}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Post Content */}
          <div className="post-content">
            {post.content?.map((item, index) => (
              <div key={index} className="content-block">
                {item.type === "text" && item.para && (
                  <p className="content-text">{item.para}</p>
                )}
                {item.type === "text" && item.content?.para && (
                  <p className="content-text">{item.content.para}</p>
                )}
                {item.type === "image" && (item.url || item.content?.image_url) && (
                  <figure className="content-image">
                    <img 
                      src={item.url || item.content.image_url} 
                      alt="Post content"
                      loading="lazy"
                    />
                  </figure>
                )}
                {item.type === "video" && (item.url || item.content?.video_url) && (
                  <figure className="content-video">
                    <video controls>
                      <source src={item.url || item.content.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </figure>
                )}
              </div>
            ))}
          </div>

          {/* Post Actions */}
          <div className="post-actions-bar">
            <div className="action-group">
              <button 
                className={`action-button ${hasLiked ? 'active' : ''}`}
                onClick={handleLike}
                disabled={actionLoading}
              >
                {hasLiked ? <FaHeart /> : <FaRegHeart />}
                <span>{post.likes?.length || 0}</span>
              </button>

              <button 
                className={`action-button ${hasDisliked ? 'active' : ''}`}
                onClick={handleDislike}
                disabled={actionLoading}
              >
                {hasDisliked ? <FaThumbsDown /> : <FaRegThumbsDown />}
                <span>{post.dislikes?.length || 0}</span>
              </button>

              <button className="action-button">
                <FaComment />
                <span>{post.comments?.length || 0}</span>
              </button>
            </div>

            <div className="action-group">
              <button 
                className={`action-button ${hasFavorited ? 'active' : ''}`}
                onClick={handleFavorite}
                disabled={actionLoading}
                title={hasFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                {hasFavorited ? <FaBookmark /> : <FaRegBookmark />}
              </button>

              <button 
                className="action-button"
                onClick={handleShare}
                title="Share post"
              >
                <FaShare />
              </button>
            </div>
          </div>

          {/* Comments Section (Placeholder) */}
          <div className="comments-section">
            <h2 className="comments-title">
              Comments ({post.comments?.length || 0})
            </h2>
            <div className="comments-placeholder">
              <p>Comments section coming soon...</p>
              <p className="comments-note">
                Share your thoughts and engage with other readers
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SinglePostPage;