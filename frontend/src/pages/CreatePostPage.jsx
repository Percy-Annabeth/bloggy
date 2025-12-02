import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTrash, FaImage, FaVideo, FaAlignLeft, FaEye } from "react-icons/fa";
import API_BASE_URL from "../utils/APIBaseUrl";
import "./CreatePostPage.css";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();

  // Add content block
  const addContentBlock = (type) => {
    const newBlock = { 
      type, 
      content: type === "text" ? "" : null,
      id: Date.now()
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  // Handle text content change
  const handleContentChange = (id, value) => {
    setContentBlocks(contentBlocks.map(block =>
      block.id === id ? { ...block, content: value } : block
    ));
  };

  // Handle file upload
  const handleFileUpload = (id, file) => {
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ 
        type: "error", 
        text: "File size must be less than 10MB" 
      });
      return;
    }

    setContentBlocks(contentBlocks.map(block =>
      block.id === id ? { ...block, content: file } : block
    ));
  };

  // Remove block
  const removeBlock = (id) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
  };

  // Move block up
  const moveBlockUp = (index) => {
    if (index === 0) return;
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  // Move block down
  const moveBlockDown = (index) => {
    if (index === contentBlocks.length - 1) return;
    const newBlocks = [...contentBlocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage({ 
        type: "error", 
        text: "You must be logged in to create a post" 
      });
      setTimeout(() => navigate("/auth"), 2000);
      return;
    }

    if (!title.trim()) {
      setMessage({ type: "error", text: "Title is required" });
      return;
    }

    if (contentBlocks.length === 0) {
      setMessage({ 
        type: "error", 
        text: "Please add some content to your post" 
      });
      return;
    }

    // Validate all blocks have content
    const hasEmptyBlocks = contentBlocks.some(block => 
      block.type === "text" ? !block.content.trim() : !block.content
    );

    if (hasEmptyBlocks) {
      setMessage({ 
        type: "error", 
        text: "Please fill in all content blocks or remove empty ones" 
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const storedUser = localStorage.getItem("user");
      const user = JSON.parse(storedUser);
      const userId = user._id;

      const formData = new FormData();
      formData.append("title", title);

      // Prepare content
      const contentData = contentBlocks.map(block => ({
        type: block.type,
        content: block.type === "text" ? block.content : null
      }));

      formData.append("content", JSON.stringify(contentData));

      // Append files
      contentBlocks.forEach(block => {
        if ((block.type === "image" || block.type === "video") && block.content) {
          formData.append("files", block.content);
        }
      });

      const response = await axios.post(
        `${API_BASE_URL}/posts/createpostbyuser/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setMessage({ 
          type: "success", 
          text: "Post created successfully! Redirecting..." 
        });
        
        setTimeout(() => {
          navigate(`/posts/${response.data.data._id}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create post. Please try again."
      });
      setIsSubmitting(false);
    }
  };

  // Get file preview
  const getFilePreview = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

  return (
    <div className="create-post-page">
      {/* Hero Section */}
      <section className="create-post-hero">
        <div className="create-post-hero-overlay"></div>
        <div className="container">
          <h1 className="create-post-hero-title">Create Your Story</h1>
          <p className="create-post-hero-subtitle">
            Share your thoughts, experiences, and ideas with the world
          </p>
        </div>
      </section>

      <div className="container create-post-container">
        <div className="create-post-content">
          {/* Editor */}
          <div className="editor-section">
            <div className="editor-header">
              <h2>Write Your Post</h2>
              <button
                type="button"
                className="preview-toggle-btn"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <FaEye />
                {previewMode ? "Edit" : "Preview"}
              </button>
            </div>

            {message.text && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            {!previewMode ? (
              <div className="editor-form">
                {/* Title Input */}
                <div className="form-group">
                  <label className="form-label">Post Title</label>
                  <input
                    type="text"
                    placeholder="Enter an engaging title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input title-input"
                    maxLength={200}
                  />
                  <span className="char-count">{title.length}/200</span>
                </div>

                {/* Content Blocks */}
                <div className="content-blocks-section">
                  <label className="form-label">Content</label>
                  
                  {contentBlocks.length === 0 && (
                    <div className="empty-content">
                      <p>Start building your post by adding content blocks</p>
                    </div>
                  )}

                  {contentBlocks.map((block, index) => (
                    <div key={block.id} className="content-block">
                      <div className="block-header">
                        <span className="block-type">
                          {block.type === "text" && <FaAlignLeft />}
                          {block.type === "image" && <FaImage />}
                          {block.type === "video" && <FaVideo />}
                          {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                        </span>
                        <div className="block-actions">
                          <button
                            type="button"
                            onClick={() => moveBlockUp(index)}
                            disabled={index === 0}
                            className="block-action-btn"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlockDown(index)}
                            disabled={index === contentBlocks.length - 1}
                            className="block-action-btn"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="block-action-btn delete-btn"
                            title="Remove"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div className="block-content">
                        {block.type === "text" && (
                          <textarea
                            placeholder="Write your content here..."
                            value={block.content}
                            onChange={(e) => handleContentChange(block.id, e.target.value)}
                            className="form-textarea"
                            rows={6}
                          />
                        )}

                        {(block.type === "image" || block.type === "video") && (
                          <div className="file-upload-block">
                            {!block.content ? (
                              <label className="file-upload-label">
                                <input
                                  type="file"
                                  accept={block.type === "image" ? "image/*" : "video/*"}
                                  onChange={(e) => handleFileUpload(block.id, e.target.files[0])}
                                  className="file-input"
                                />
                                <div className="file-upload-placeholder">
                                  {block.type === "image" ? <FaImage /> : <FaVideo />}
                                  <p>Click to upload {block.type}</p>
                                  <span className="file-hint">Max size: 10MB</span>
                                </div>
                              </label>
                            ) : (
                              <div className="file-preview">
                                {block.type === "image" && (
                                  <img 
                                    src={getFilePreview(block.content)} 
                                    alt="Preview" 
                                  />
                                )}
                                {block.type === "video" && (
                                  <video 
                                    src={getFilePreview(block.content)} 
                                    controls 
                                  />
                                )}
                                <p className="file-name">{block.content.name}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Block Buttons */}
                  <div className="add-block-buttons">
                    <button
                      type="button"
                      onClick={() => addContentBlock("text")}
                      className="add-block-btn"
                    >
                      <FaAlignLeft />
                      Add Text
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock("image")}
                      className="add-block-btn"
                    >
                      <FaImage />
                      Add Image
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock("video")}
                      className="add-block-btn"
                    >
                      <FaVideo />
                      Add Video
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg submit-btn"
                >
                  {isSubmitting ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            ) : (
              /* Preview Mode */
              <div className="post-preview">
                <h1 className="preview-title">{title || "Untitled Post"}</h1>
                <div className="preview-content">
                  {contentBlocks.map((block, index) => (
                    <div key={block.id} className="preview-block">
                      {block.type === "text" && (
                        <p className="preview-text">{block.content}</p>
                      )}
                      {block.type === "image" && block.content && (
                        <img 
                          src={getFilePreview(block.content)} 
                          alt={`Content ${index + 1}`}
                          className="preview-image"
                        />
                      )}
                      {block.type === "video" && block.content && (
                        <video 
                          src={getFilePreview(block.content)} 
                          controls
                          className="preview-video"
                        />
                      )}
                    </div>
                  ))}
                  {contentBlocks.length === 0 && (
                    <p className="preview-empty">No content to preview</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tips Sidebar */}
          <aside className="tips-sidebar">
            <div className="tips-card">
              <h3 className="tips-title">✍️ Writing Tips</h3>
              <ul className="tips-list">
                <li>Write a catchy title that grabs attention</li>
                <li>Start with a strong opening paragraph</li>
                <li>Use images and videos to enhance your story</li>
                <li>Break content into readable paragraphs</li>
                <li>Proofread before publishing</li>
              </ul>
            </div>

            <div className="tips-card">
              <h3 className="tips-title">📸 Media Guidelines</h3>
              <ul className="tips-list">
                <li>Use high-quality images (min 800px wide)</li>
                <li>Keep videos under 5 minutes</li>
                <li>Compress large files before uploading</li>
                <li>Use relevant visuals that support your content</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;