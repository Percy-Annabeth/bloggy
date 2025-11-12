import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";

const ActionIcon = ({ 
  actionType,  
  postId, 
  currentUserId, 
  initialState = [], 
  iconStates = { active: "✔️", inactive: "✖️" },
  onUpdate // New prop to update counts in SinglePostPage
}) => {
  console.log(`${actionType} Icon Rendered!`);

  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(initialState.length);

  useEffect(() => {
    setIsActive(initialState.some((entry) => entry.user === currentUserId));
  }, [initialState, currentUserId]);


  const handleAction = async () => {
    try {

        const isCurrentlyActive = isActive; // Store current state before updating

      const actionRoutes = {
        like: "like",
        dislike: "dislike",
        favourite: isCurrentlyActive ? "remfavourite" : "addfavourite" // Toggle API call
      };
  
      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}/${actionRoutes[actionType]}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      let updatedList;
      if (actionType === "favourite") { 
        updatedList = response.data.data.favourited_by;
      } else {
        updatedList = response.data.data[`${actionType}s`];
      }
  
      setIsActive(updatedList.some((entry) => entry.user === currentUserId));
      setCount(updatedList.length);
  
      let userAction = isActive ? "removed" : actionType;
      onUpdate(updatedList, userAction);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message);
      } else {
        console.error(`Error performing ${actionType} action`, err);
      }
    }
  };
  
  

  return (
    <div>
      <button onClick={handleAction} style={{ border: "none", background: "none", cursor: "pointer" }}>
        {isActive ? (
          <span style={{ color: "red", fontSize: "24px" }}>{iconStates.active}</span>
        ) : (
          <span style={{ fontSize: "24px" }}>{iconStates.inactive}</span>
        )}
      </button>
      {/* <span>{count}</span> */}
    </div>
  );
};

export default ActionIcon;
