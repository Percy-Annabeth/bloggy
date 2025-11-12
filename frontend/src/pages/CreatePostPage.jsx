
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../utils/APIBaseUrl";
import "./CreatePostPage.css";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const navigate = useNavigate();


  //yaha galti error ho sakta hai. har case me "" use hora hai.
  const addContentBlock = (type) => {
    const newBlock = { type, content: "" };
    setContentBlocks([...contentBlocks, newBlock]);
  };
  

  const handleContentChange = (index, event) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].content = event.target.value;
    setContentBlocks(newBlocks);
  };

  const handleFileUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newBlocks = [...contentBlocks];
      newBlocks[index].content = file;
      setContentBlocks(newBlocks);
    }
    console.log(file,"file");
  };

  const removeBlock = (index) => {
    const newBlocks = [...contentBlocks];
    newBlocks.splice(index, 1);
    setContentBlocks(newBlocks);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You need to be logged in to create a post.");
      navigate("/auth");
      return;
    }

    const hasContent = contentBlocks.length > 0;
    if (!hasContent) {
      setMessage("Please add some content to your post.");
      return;
    }
console.log("yo whats happen");
  

  try{

      const storedUser = localStorage.getItem("user");
      const strduser = JSON.parse(storedUser);
      const strduserId = strduser._id;
      console.log("yo whats happpppppppppppppen");

      const formData = new FormData();

      formData.append("title",title);


contentBlocks.forEach((block, index) => {
  if (block.type === "text") {
    formData.append(`content[${index}][type]`, "text");
    formData.append(`content[${index}][chotacontent]`, block.content);
  } else if (block.type === "image" || block.type === "video") {
    formData.append(`content[${index}][type]`, block.type);
    formData.append(`content[${index}][file]`, block.content);
  }
});

console.log(formData,"formdata");
console.log(contentBlocks,"contentblocks");

console.log("Formatted FormData:");
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

      const response = await axios.post(
        `${API_BASE_URL}/posts/createpostbyuser/${strduserId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("yo whats happfffffffffffen");

console.log("response",response);
console.log("heyyy");
      if (response.status === 201) {
        setMessage("Post created successfully!");
        setContentBlocks([]);
      setTitle("");
      } else {
        setMessage(response.data.error || "Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage(
        error.response?.data?.message  ,"lolllllolol" ||
          "An error occurred while creating the post."
      );
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      {message && <p className="create-post-message">{message}</p>}
      <form className="create-post-form" onSubmit={handleCreatePost} enctype="multipart/form-data">
        <input
          type="text"
          placeholder="Enter Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="create-post-input"
        />
        <div className="content-options">
          <button type="button" onClick={() => addContentBlock("text")}>Add Text</button>
          <button type="button" onClick={() => addContentBlock("image")}>Add Image</button>
          <button type="button" onClick={() => addContentBlock("video")}>Add Video</button>
        </div>
        {contentBlocks.map((block, index) => (
          <div key={index} className="content-block">
            {block.type === "text" && (
              <textarea
                placeholder="Write something..."
                value={block.content}
                onChange={(e) => handleContentChange(index, e)}
                required
              />
            )}
            {block.type === "image" && (
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(index, e)} />
            )}
            {block.type === "video" && (
              <input type="file" accept="video/*" onChange={(e) => handleFileUpload(index, e)} />
            )}
            <button type="button" onClick={() => removeBlock(index)}>Remove</button>
          </div>
        ))}
        <button type="submit" className="create-post-button">Publish Post</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
