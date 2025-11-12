import React, { useEffect, useState } from "react";
import { useParams, useNavigate ,useLocation} from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";
// import "./VisitorProfilePage.css";
const VisitorProfilePage = (props) => {

  const { userId } = useParams();
  const navigate = useNavigate();
  const [visitorProfile, setVisitorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [message,setMessage] = useState("");
  const user = localStorage.getItem("user");
  console.log("user",user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(userId);
        const response = await axios.get(`${API_BASE_URL}/users/visitorprofile/${userId}`);
        console.log(response.data.data);
        setVisitorProfile(response.data.data);
        console.log("profiel; :",visitorProfile);
        console.log("user : ",user);
        setIsSubscribed(response.data.data.subscribers.includes(user._id));
      } catch (error) {
        console.error("API request failed:", error);

        setError("Failed to fetch user profissssle");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, user]);

  useEffect(() => {
    if (visitorProfile) {
      console.log("Updated profile state:", visitorProfile);
    }
  }, [visitorProfile]);

  const handleSubscription = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${userId}/subscribe`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`} }
      );
      setIsSubscribed((prev) => !prev);
      alert(response.data.message);
    //   setMessage(response.data.message);
    //   setTimeout(() => {
    //     setMessage("");
    // }, 1000);
    } catch (err) {
      console.error("Error updating subscription", err);
    }
  };

  if (loading) return <p>Loading... please wait...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="visitor-profile-page">
      <div className="profile-header">
        <img src={visitorProfile.profilePicture} alt={visitorProfile.name} className="profile-pic" />
        <h1>{visitorProfile.name}</h1>
      </div>
      <button className="subscribe-btn" onClick={handleSubscription}>
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
      </button>
      {message && <p className="subscription-message">{message}</p>}

      <div className="user-posts">
        <h2>Posts by {visitorProfile.name}</h2>
        {visitorProfile.posts.length > 0 ? (
          visitorProfile.posts.map((post) => (
            <div key={post._id} className="post-card" onClick={() => navigate(`/post/${post._id}`)}>
              <h3>{post.title}</h3>
              <p>{post.content[0].para.slice(0, 100)}...</p>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default VisitorProfilePage;
