import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";
import "./PostCard.css"; // Separate CSS for styling
import { FaEdit, FaTrash } from "react-icons/fa"; // Icons for update & delete

const PostCard = ({ post, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(post._id); // Remove post from UI after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdate = async () => {
    // Redirect to edit page (this can be updated later)
    alert("Update feature will be added soon!");

  };
  console.log(post);

  return (
    <div className="post-card">
      <h3 className="post-title">{post.title}</h3>
      <p className="post-date">Created At: {new Date(post.createdAt).toDateString()}</p>
      <p>Views:{post.views}</p>
      <p className="post-content">
        {Array.isArray(post.content) && post.content.length > 0
          ? post.content.map((item, index) => (
              <span key={index}>
                {typeof item.para === "string" ? item.para.substring(0, 150) : ""}
              </span>
            ))
          : "No content available"}
      </p>

      <div className="post-actions">
        <p className="post-likes">👍 {post.likes.length} | 👎 {post.dislikes.length}</p>
        <FaEdit className="edit-icon" onClick={handleUpdate} />
        <FaTrash className="delete-icon" onClick={handleDelete} />
      </div>

      <Link to={`/posts/${post._id}`} className="view-post-link">View Post</Link>
    </div>
  );
};

export default PostCard;
