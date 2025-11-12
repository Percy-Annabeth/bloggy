// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../utils/APIBaseUrl";
import "./ProfilePage.css";
import axios from "axios"; // Import Axios
import PostCard from "../components/PostCard";


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userFavPosts, setUserFavPosts] = useState([]);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  
  useEffect(()=>{
    const fetchfavouriteposts = async()=>{
    try{
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const strduser = JSON.parse(storedUser);
      const strduserId = strduser._id;


      const response = await axios.get(`${API_BASE_URL}/posts/favourites`,{
        headers:{
          Authorization:`Bearer ${token}`,
          user:strduserId,
        }
    });
    const {data} = response;
    console.log("the final daTA",data);
    if(data.success){
      setUserFavPosts(data.data||[]);
    }
console.log("the fav posts",userFavPosts);
    }catch(e){
      console.log("Error fetching user data:", e);
      setMessage("An error occurred while fetching user data.");
    }
  }
  fetchfavouriteposts();

  },[navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You are not logged in. Please log in again.");
          navigate("/auth");
          return;
        }
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setMessage("User not found in local storage.");
          return;
        }

        const strduser = JSON.parse(storedUser);
        if (!strduser._id) {
          setMessage("Invalid user data in local storage.");
          return;
        }

        const strduserId = strduser._id;
        // Fetch user profile data
        const response = await axios.get(`${API_BASE_URL}/users/profile/${strduserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const {data} = response;
        
        if (data.success) {
          setUser(data.data);
          setUserPosts(data.data.posts || []);
          setMessage("");
        } else {
          setMessage(data.message || "Error fetching profile data.");
        }
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("An error occurred while fetching user data.");
      }
    };

    fetchUserData();
  }, [navigate]);

  
  const handleDelete = (postId) => {
    setUserPosts(userPosts.filter((post) => post._id !== postId));
  };
// console.log(user.posts);
  // const firstParagraph = Array.isArray(user.posts.content) && user.posts.content.length > 0? user.posts.content.para[0]: "Content unavailable";
  // firstParagraph.substring(0, 100)
  return (
    <div className="profile-page">
      {user ? (
        <>
          <h2>Your Profile</h2>
          <div className="profile-info">
            {/* Add avatar or profile picture if available */}
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Your Subscibers: {user.subscribers}</p>
            <p>you have Subscribed to: {user.subscribed}</p>
            <p>your Reading List: {user.reading_list}</p>

          </div>

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <h3>Your Posts</h3>
          {userPosts.length ? (
            <div className="user-posts">
              {userPosts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
            </div>
          ) : (
            <p>No posts found.</p>
          )}

<h3>Your favourite Posts</h3>
          {userFavPosts.length ? (
            <div className="user-posts">
              {userFavPosts.map((favpost) => (
            <PostCard key={favpost._id} post={favpost} onDelete={handleDelete} />
          ))}
            </div>
          ) : (
            <p>No posts found.</p>
          )}

        </>
      ) : (
        <p>Loading profile...</p>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProfilePage;
