// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import API_BASE_URL from "../utils/APIBaseUrl";
// import "./SinglePostPage.css";
// import ActionIcon from "../components/ActionIcon";

// const SinglePostPage = ({ user }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Separate state for likes and dislikes count
//   const [likesCount, setLikesCount] = useState(0);
//   const [dislikesCount, setDislikesCount] = useState(0);
//   const [favouritesCount, setFavouritesCount] = useState(0);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
//         const postData = response.data.data;
//         setPost(postData);
//         setLikesCount(postData.likes.length);
//         setDislikesCount(postData.dislikes.length);
//       } catch (err) {
//         setError("Failed to fetch post");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, [id]);
//   const handleLikesUpdate = (updatedLikes, userAction) => {
//     setLikesCount(updatedLikes.length);
  
//     if (userAction === "like") {
//       // If the user previously disliked and now liked, reduce dislikes count
//       setDislikesCount((prev) => Math.max(prev - 1, 0));
//     }
//   };
  
//   const handleDislikesUpdate = (updatedDislikes, userAction) => {
//     setDislikesCount(updatedDislikes.length);
  
//     if (userAction === "dislike") {
//       // If the user previously liked and now disliked, reduce likes count
//       setLikesCount((prev) => Math.max(prev - 1, 0));
//     }
//   };
  
//   const handleFavouritesUpdate = (updatedFavourites) => {
//     setFavouritesCount(updatedFavourites.length);
//   };
  
//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${API_BASE_URL}/posts/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       navigate("/");
//     } catch (err) {
//       console.error("Error deleting post", err);
//     }
//   };

//   if (loading) return <p>Loading... please wait...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className="single-post-page">  
//       <div className="post-container">
//         <h1 className="post-title">{post.title}</h1>
//         <p className="post-meta">By {post.user} at {new Date(post.createdAt).toLocaleDateString()}</p>
//         <div className="post-content">{post.content[0].para}</div>

//         <div className="post-stats">
//         <p>Views:{post.views}</p>

//           <div className="post-likes">{likesCount} </div>
//           <div className="post-likes">{dislikesCount} </div>
//           <div className="post-likes">{favouritesCount} </div>


//           <ActionIcon 
//             actionType="like" 
//             postId={post._id} 
//             currentUserId={localStorage.getItem("userId")} 
//             initialState={post.likes} 
//             iconStates={{ active: "👍", inactive: "👍" }}
//             onUpdate={handleLikesUpdate} // Pass handler for likes update
//           />

//           <ActionIcon 
//             actionType="dislike" 
//             postId={post._id} 
//             currentUserId={localStorage.getItem("userId")} 
//             initialState={post.dislikes} 
//             iconStates={{ active: "👎", inactive: "👎🏽" }}
//             onUpdate={handleDislikesUpdate} // Pass handler for dislikes update
//           />
//         </div>

//         <ActionIcon 
//             actionType="favourite" 
//             postId={post._id} 
//             currentUserId={localStorage.getItem("userId")} 
//             initialState={post.favourited_by} 
//             iconStates={{ active: "❤️", inactive: "🤍" }}
//             onUpdate={handleFavouritesUpdate} // Pass handler for likes update
//           />

//         {user && user._id === post.authorId && (
//           <div className="post-actions">
//             <button className="edit-btn" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
//             <button className="delete-btn" onClick={handleDelete}>Delete</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SinglePostPage;












// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import API_BASE_URL from "../utils/APIBaseUrl";
// import "./SinglePostPage.css";
// import ActionIcon from "../components/ActionIcon";

// const SinglePostPage = ({ user }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Separate state for likes and dislikes count
//   const [likesCount, setLikesCount] = useState(0);
//   const [dislikesCount, setDislikesCount] = useState(0);
//   const [favouritesCount, setFavouritesCount] = useState(0);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
//         const postData = response.data.data;
//         setPost(postData);
//         setLikesCount(postData.likes.length);
//         setDislikesCount(postData.dislikes.length);
//       } catch (err) {
//         setError("Failed to fetch post");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, [id]);

//   const handleLikesUpdate = (updatedLikes, userAction) => {
//     setLikesCount(updatedLikes.length);
//     if (userAction === "like") {
//       setDislikesCount((prev) => Math.max(prev - 1, 0));
//     }
//   };

//   const handleDislikesUpdate = (updatedDislikes, userAction) => {
//     setDislikesCount(updatedDislikes.length);
//     if (userAction === "dislike") {
//       setLikesCount((prev) => Math.max(prev - 1, 0));
//     }
//   };

//   const handleFavouritesUpdate = (updatedFavourites) => {
//     setFavouritesCount(updatedFavourites.length);
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${API_BASE_URL}/posts/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       navigate("/");
//     } catch (err) {
//       console.error("Error deleting post", err);
//     }
//   };

//   if (loading) return <p>Loading... please wait...</p>;
//   if (error) return <p className="error">{error}</p>;
// console.log("post user",post);
//   return (
//     <div className="single-post-page">
//       <div className="post-container">
//         <h1 className="post-title">{post.title}</h1>
//         <p className="post-meta">
//           By user : <span className="author-link" onClick={() => navigate(`/visitorprofile/${post.user._id}`)}>{post.user.name}</span> 
//           at the time of {new Date(post.createdAt).toLocaleDateString()}
//         </p>
//         <div className="post-content">{post.content[0].para}</div>

//         <div className="post-stats">
//           <p>Views: {post.views}</p>
//           <div className="post-likes">{likesCount} </div>
//           <div className="post-likes">{dislikesCount} </div>
//           <div className="post-likes">{favouritesCount} </div>

//           <ActionIcon 
//             actionType="like" 
//             postId={post._id} 
//             currentUserId={localStorage.getItem("userId")} 
//             initialState={post.likes} 
//             iconStates={{ active: "👍", inactive: "👍" }}
//             onUpdate={handleLikesUpdate} 
//           />

//           <ActionIcon 
//             actionType="dislike" 
//             postId={post._id} 
//             currentUserId={localStorage.getItem("userId")} 
//             initialState={post.dislikes} 
//             iconStates={{ active: "👎", inactive: "👎🏽" }}
//             onUpdate={handleDislikesUpdate} 
//           />
//         </div>

//         <ActionIcon 
//           actionType="favourite" 
//           postId={post._id} 
//           currentUserId={localStorage.getItem("userId")} 
//           initialState={post.favourited_by} 
//           iconStates={{ active: "❤️", inactive: "🤍" }}
//           onUpdate={handleFavouritesUpdate} 
//         />

//         {user && user._id === post.authorId && (
//           <div className="post-actions">
//             <button className="edit-btn" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
//             <button className="delete-btn" onClick={handleDelete}>Delete</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SinglePostPage;












import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";
import "./SinglePostPage.css";
import ActionIcon from "../components/ActionIcon";

const SinglePostPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
        const postData = response.data.data;
        setPost(postData);
        console.log(postData);
        setLikesCount(postData.likes.length);
        setDislikesCount(postData.dislikes.length);
      } catch (err) {
        setError("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLikesUpdate = (updatedLikes, userAction) => {
    setLikesCount(updatedLikes.length);
    if (userAction === "like") {
      setDislikesCount((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleDislikesUpdate = (updatedDislikes, userAction) => {
    setDislikesCount(updatedDislikes.length);
    if (userAction === "dislike") {
      setLikesCount((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleFavouritesUpdate = (updatedFavourites) => {
    setFavouritesCount(updatedFavourites.length);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/");
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  if (loading) return <p>Loading... please wait...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="single-post-page">
      <div className="post-container">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-meta">
          By user:{" "}
          <span
            className="author-link"
            onClick={() => navigate(`/visitorprofile/${post.user._id}`)}
          >
            {post.user.name}
          </span>{" "}
          at {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <div className="post-content">
  {post.content && post.content.length > 0 ? (
    post.content.map((item, index) => {
      if (item.type === "text" && item.content?.para) {
        return <p key={index} className="post-text">{item.content.para}</p>;
      } else if (item.type === "image" && item.content?.image_url) {
        return <img key={index} className="post-image" src={item.content.image_url} alt="Post media" />;
      } else if (item.type === "video" && item.content?.video_url) {
        return (
          <video key={index} className="post-video" controls>
            <source src={item.content.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return null;
      }
    })
  ) : (
    <p>No content available.</p>
  )}
</div>


        <div className="post-stats">
          <p>Views: {post.views}</p>
          <div className="post-likes">{likesCount} </div>
          <div className="post-likes">{dislikesCount} </div>
          <div className="post-likes">{favouritesCount} </div>

          <ActionIcon
            actionType="like"
            postId={post._id}
            currentUserId={localStorage.getItem("userId")}
            initialState={post.likes}
            iconStates={{ active: "👍", inactive: "👍" }}
            onUpdate={handleLikesUpdate}
          />

          <ActionIcon
            actionType="dislike"
            postId={post._id}
            currentUserId={localStorage.getItem("userId")}
            initialState={post.dislikes}
            iconStates={{ active: "👎", inactive: "👎🏽" }}
            onUpdate={handleDislikesUpdate}
          />
        </div>

        <ActionIcon
          actionType="favourite"
          postId={post._id}
          currentUserId={localStorage.getItem("userId")}
          initialState={post.favourited_by}
          iconStates={{ active: "❤️", inactive: "🤍" }}
          onUpdate={handleFavouritesUpdate}
        />

        {user && user._id === post.authorId && (
          <div className="post-actions">
            <button className="edit-btn" onClick={() => navigate(`/edit/${id}`)}>
              Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePostPage;
