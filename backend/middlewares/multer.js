// const Post = require("../models/Post");
// const cloudinary = require("../cloudinary");
const multer = require("multer");
const path = require("path");



// Multer storage (Store files in memory for direct upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter to allow only images and videos
console.log("multer me hu bhai");
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};
console.log("multer chal gaya bhai");
const upload = multer({ storage, fileFilter });
module.exports = upload;

// exports.createPost = async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const userId = req.user.id; // Assuming user is authenticated and ID is available

//     if (!title || !content || !Array.isArray(content)) {
//       return res.status(400).json({ message: "Title and content are required!" });
//     }

//     let processedContent = [];

//     for (let item of content) {
//       let newItem = {};
//       if (item.type === "text") {
//         newItem = {
//           para: item.content,
//         };
//       } else if (item.type === "image" || item.type === "video") {
//         const uploadResponse = await cloudinary.uploader.upload(item.content, {
//           resource_type: item.type === "image" ? "image" : "video",
//         });

//         newItem = {
//           [item.type]: {
//             [`${item.type}_url`]: uploadResponse.secure_url,
//           },
//         };
//       }
//       processedContent.push(newItem);
//     }

//     const newPost = new Post({
//       title,
//       user: userId,
//       content: processedContent,
//     });

//     await newPost.save();
//     res.status(201).json({ message: "Post created successfully!", post: newPost });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

