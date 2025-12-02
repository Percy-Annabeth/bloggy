import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaThLarge, FaList, FaFilter, FaTimes, FaTh } from "react-icons/fa";
import API_BASE_URL from "../utils/APIBaseUrl";
import PostCard from "../components/PostCard";
import "./DiscoverPage.css";

const DiscoverPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid, list, or tile
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filters
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  
  const availableTags = ["Technology", "AI", "ML", "Data Science", "Blockchain", "Web Development", "Mobile", "Design", "Business", "Lifestyle"];

  // Fetch posts
  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      
      let url = `${API_BASE_URL}/posts?page=${pageNum}&limit=12&sortBy=${sortBy}`;
      
      if (searchQuery.trim()) {
        url = `${API_BASE_URL}/posts/search?q=${encodeURIComponent(searchQuery)}`;
      } else if (selectedTags.length > 0) {
        url = `${API_BASE_URL}/posts/filter?tags=${selectedTags.join(",")}`;
      }
      
      const response = await axios.get(url);
      const newPosts = response.data.data || response.data.posts || [];
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      const pagination = response.data.pagination;
      if (pagination) {
        setHasMore(pageNum < pagination.pages);
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  }, [searchQuery, selectedTags, sortBy]);

  useEffect(() => {
    setPage(1);
    fetchPosts(1, true);
  }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 500
        && !loading && hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page, false);
    }
  }, [page]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
    setSortBy("-createdAt");
    setSearchParams({});
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  return (
    <div className="discover-page">
      <section className="discover-hero">
        <div className="discover-hero-overlay"></div>
        <div className="container">
          <h1 className="discover-hero-title">Discover Amazing Stories</h1>
          <p className="discover-hero-subtitle">
            Explore posts from writers around the world
          </p>
        </div>
      </section>

      <div className="container discover-container">
        <div className="discover-controls">
          <div className="controls-left">
            <button
              className="filter-toggle-btn btn btn-sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FaFilter />
              Filters
              {(selectedTags.length > 0 || searchQuery) && (
                <span className="filter-badge">{selectedTags.length + (searchQuery ? 1 : 0)}</span>
              )}
            </button>

            {(selectedTags.length > 0 || searchQuery) && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                <FaTimes /> Clear All
              </button>
            )}
          </div>

          <div className="controls-right">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="-createdAt">Latest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-views">Most Viewed</option>
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "tile" ? "active" : ""}`}
                onClick={() => setViewMode("tile")}
                aria-label="Tile view"
                title="Compact Tiles"
              >
                <FaTh />
              </button>
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                title="Detailed Grid"
              >
                <FaThLarge />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                title="List View"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {filterOpen && (
          <div className="filter-panel">
            <h3 className="filter-title">Filter by Tags</h3>
            <div className="tag-filters">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-filter ${selectedTags.includes(tag) ? "active" : ""}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  {selectedTags.includes(tag) && <FaTimes className="tag-remove" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {(selectedTags.length > 0 || searchQuery) && (
          <div className="active-filters">
            <span className="active-filters-label">Active Filters:</span>
            {searchQuery && (
              <span className="active-filter-chip">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")}>
                  <FaTimes />
                </button>
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="active-filter-chip">
                {tag}
                <button onClick={() => handleTagToggle(tag)}>
                  <FaTimes />
                </button>
              </span>
            ))}
          </div>
        )}

        {loading && page === 1 ? (
          <div className={`posts-${viewMode}`}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton skeleton-card"></div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className={`posts-${viewMode}`}>
              {posts.map(post => (
                viewMode === "tile" ? (
                  <TileCard key={post._id} post={post} onDelete={handleDelete} />
                ) : (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    onDelete={handleDelete}
                    viewMode={viewMode}
                  />
                )
              ))}
            </div>

            {loading && page > 1 && (
              <div className="load-more-indicator">
                <div className="spinner"></div>
                <p>Loading more posts...</p>
              </div>
            )}

            {!hasMore && (
              <div className="end-message">
                <p>You've reached the end! 🎉</p>
                <p className="end-message-sub">
                  {posts.length} {posts.length === 1 ? "post" : "posts"} found
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="no-posts">
            <div className="no-posts-icon">📭</div>
            <h3>No posts found</h3>
            <p>Try adjusting your filters or search query</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact Tile Card Component
const TileCard = ({ post, onDelete }) => {
  const getPostImage = () => {
    if (post.content && Array.isArray(post.content)) {
      const imageContent = post.content.find(item => item.type === "image");
      return imageContent?.url || imageContent?.content?.image_url;
    }
    return null;
  };

  const postImage = getPostImage();

  return (
    <article className="tile-card">
      <a href={`/posts/${post._id}`} className="tile-card-link">
        {postImage && (
          <div className="tile-card-image">
            <img src={postImage} alt={post.title} loading="lazy" />
          </div>
        )}
        <div className="tile-card-content">
          <h3 className="tile-card-title">{post.title}</h3>
          <div className="tile-card-stats">
            <span>❤️ {post.likes?.length || 0}</span>
            <span>💬 {post.comments?.length || 0}</span>
            <span>👁️ {post.views || 0}</span>
          </div>
        </div>
      </a>
    </article>
  );
};

export default DiscoverPage;