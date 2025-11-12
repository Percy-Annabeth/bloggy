import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";
import PostCard from "../components/PostCard";
import "./DiscoverPage.css"; // Styling for discover page


const DiscoverPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); 

  const availableTags = ["Technology", "AI", "ML", "Data Science", "Blockchain"];

  // saari posts wala useeffect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts`);
        // console.log(response.data.posts);
        setPosts(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setMessage("Failed to load posts.");
        setLoading(false);  
      }
    };

    fetchPosts();

  }, []);

  // tags se filter hoke posts dene wala useeffect
  useEffect(() => {
    if (selectedTags.length === 0) return; // If no tags are selected, don't fetch filtered posts

    const fetchFilteredPosts = async () => {
      try {
        const queryString = selectedTags.join(","); // Convert array to comma-separated string
        console.log("this is querystring",queryString);
        console.log("this is selectedtags array",selectedTags);

        const response = await axios.get(`${API_BASE_URL}/posts/filter?tags=${queryString}`);
        console.log("this is querystring 3",queryString);
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching filtered posts:", error);
      }
    };

    fetchFilteredPosts();
  }, [selectedTags]);

  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };


  const handleDelete = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return (
    <div className="discover-page">
      <h2>Discover Posts</h2>

      <div className="filter-section">
        <h3>Filter by Tags:</h3>
        {availableTags.map((tag) => (
          <label key={tag} className="tag-label">
            <input
              type="checkbox"
              value={tag}
              checked={selectedTags.includes(tag)}
              onChange={() => handleTagChange(tag)}
            />
            {tag}
          </label>
        ))}
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts ? (
        <div className="post-list">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default DiscoverPage;
