import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";
import "./PostCard.css";

const PostCard = ({ post, onDelete, featured = false }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwner = currentUser._id === post.user?._id;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (onDelete) {
        onDelete(post._id);
      } else {
        navigate("/discover");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${post._id}`);
  };

  // Extract first image from content
  const getPostImage = () => {
    if (post.content && Array.isArray(post.content)) {
      const imageContent = post.content.find(item => item.type === "image");
      return imageContent?.url || imageContent?.content?.image_url;
    }
    return null;
  };

  // Extract text preview
  const getTextPreview = () => {
    if (post.content && Array.isArray(post.content)) {
      const textContent = post.content.find(item => item.type === "text");
      const text = textContent?.para || textContent?.content?.para || "";
      return text.substring(0, 150) + (text.length > 150 ? "..." : "");
    }
    return "No content available";
  };

  // Calculate reading time (rough estimate)
  const calculateReadingTime = () => {
    const text = post.content
      ?.filter(item => item.type === "text")
      .map(item => item.para || item.content?.para || "")
      .join(" ");
    const words = text?.split(" ").length || 0;
    const minutes = Math.ceil(words / 200);
    return minutes < 1 ? "1 min read" : `${minutes} min read`;
  };

  const postImage = getPostImage();

  return (
    <article className={`post-card ${featured ? 'post-card-featured' : ''}`}>
      <Link to={`/posts/${post._id}`} className="post-card-link">
        {/* Post Image */}
        {postImage && (
          <div className="post-card-image">
            <img src={postImage} alt={post.title} loading="lazy" />
            <div className="post-card-overlay"></div>
          </div>
        )}

        {/* Post Content */}
        <div className="post-card-content">
          {/* Post Meta */}
          <div className="post-card-meta">
            <div className="post-author-info">
              {post.user?.profile_pic && (
                <img 
                  src={post.user.profile_pic} 
                  alt={post.user.name}
                  className="author-avatar"
                />
              )}
              <span className="author-name">{post.user?.name || "Anonymous"}</span>
            </div>
            <div className="post-reading-time">
              <i className="fa-regular fa-clock stat-icon"></i>
              <span>{calculateReadingTime()}</span>
            </div>
          </div>

          {/* Post Title */}
          <h3 className="post-card-title">{post.title}</h3>

          {/* Post Excerpt */}
          <p className="post-card-excerpt">{getTextPreview()}</p>

          {/* Post Stats */}
          <div className="post-card-stats">
            <div className="stat-item">
              <i className="fa-solid fa-heart stat-icon"></i>
              <span>{post.likes?.length || 0}</span>
            </div>
            <div className="stat-item">
              <i className="fa-solid fa-comment stat-icon"></i>
              <span>{post.comments?.length || 0}</span>
            </div>
            <div className="stat-item">
              <i className="fa-solid fa-eye stat-icon"></i>
              <span>{post.views || 0}</span>
            </div>
            <div className="post-card-date">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="post-card-actions">
              <button
                className="action-btn edit-btn"
                onClick={handleEdit}
                aria-label="Edit post"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                className="action-btn delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete post"
              >
                {isDeleting ? "..." : <i className="fa-solid fa-trash"></i>}
              </button>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default PostCard;