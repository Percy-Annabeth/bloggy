// const Post = require("../models/postModel.js");
// const User = require("../models/userModel.js/index.js");

// exports.deletePost = async (req, res) => {
//     try {
//       const post = await Post.findByIdAndDelete(req.params.id);

//       if (!post) {
//         return res.status(404).json({
//           success: false,
//           message: "Post not found",
//         });
//       }
//       await User.findByIdAndUpdate(post.user, { $pull: { posts: req.params.id } });

//       res.status(200).json({
//         success: true,
//         message: "Post deleted successfully",
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
// exports.getPostById = async (req,res)=>{
//     try{

//         const post = await Post.findByIdAndUpdate(req.params.id,{$inc:{views:1}},{new:true})
//         .populate("likes")
//         .populate("dislikes")
//         .populate("favourited_by")
//         .populate("user","name")
//         .populate("comments");
//         // .populate("views");
//         if(!post){
//             res.status(404).json({
//                 success:false,  
//                 message:"post not found",
//             });
//         }
//         res.status(200).json({
//             success:true,
//             data:post,
//         });
//     }
//     catch(e){
//         res.status(500).json({
//             success:false,
//             message:e.message,
//         });
//     }
// };
// exports.getAllPosts = async (req,res)=>{

//     try{
//         const posts = await Post.find();

//         res.status(200).json({
//             success:true,
//             posts,
//         });
//     }
//     catch(e){
//         res.status(500).json({
//             success:false,
//             message:e.message,
//         });
//     }
// };
// exports.likePost = async (req, res) => {
//     try {
//         const { id: postId } = req.params;
//         const userId = req.user.id;
  
//         const post = await Post.findById(postId);
//         if (!post) {
//         return res.status(404).json({
//             success: false,
//             message: "Post not found",
//             });
//         }
//         if (post.likes.some((like) => like.user.toString() === userId)) {
//         return res.status(400).json({
//             success: false,
//             message: "You have already liked this post!",
//             });
//         }
//         post.dislikes = post.dislikes.filter((dislike) => dislike.user.toString() !== userId);
//         post.likes.push({ user: userId });
//         await post.save();
  
//         res.status(200).json({
//             success: true,
//             message: "Post liked successfully",
//             data: post,
//             });
//         }
//         catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: error.message,
//             });
//         }
//   };
// exports.dislikePost = async (req, res) => {
//     try {
//         const { id: postId } = req.params;
//         const userId = req.user.id;
//         const post = await Post.findById(postId);
//         if (!post) {
//         return res.status(404).json({
//             success: false,
//             message: "Post not found",
//         });
//         }
//         if (post.dislikes.some((dislike) => dislike.user.toString() === userId)) {
//         return res.status(400).json({
//             success: false,
//             message: "You have already disliked this post!",
//         });
//         }
//         post.likes = post.likes.filter((like) => like.user.toString() !== userId);
//         post.dislikes.push({ user: userId });
//         await post.save();
  
//         res.status(200).json({
//             success: true,
//             message: "Post disliked successfully",
//             data: post,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//       });
//     }
//   };
// exports.addPostToFavourites = async (req, res) => {
//     try {
//         const { id: postId } = req.params;
//         const userId = req.user.id;
  
//         const user = await User.findById(userId);
//         const post = await Post.findById(postId);
  
//         if (!user || !post) {
//            return res.status(404).json({
//                 success: false,
//                 message: "User or Post not found",
//             });
//         }
//         if (user.favourites.includes(postId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Post already in favourites",
//             });
//         }
  
//         user.favourites.push(postId);
//         await user.save();
  
//         post.favourited_by.push({ user: userId });
//         await post.save();

//         res.status(200).json({
//             success: true,
//             message: "Post added to favourites successfully",
//             data: post,

//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//       });
//     }
// };
// exports.removePostFromFavourites = async (req, res) => {
//     try {
//         const { id: postId } = req.params;
//         const userId = req.user.id;

//         const user = await User.findById(userId);
//         const post = await Post.findById(postId);

//         if (!user || !post) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User or Post not found",
//             });
//         }

//         // Check if the post is in user's favourites
//         if (!user.favourites.includes(postId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Post is not in favourites",
//             });
//         }

//         // Remove post from user's favourites list
//         user.favourites = user.favourites.filter((favId) => favId.toString() !== postId);
//         await user.save();

//         // Remove user from post's favourited_by array
//         post.favourited_by = post.favourited_by.filter((fav) => fav.user.toString() !== userId);
//         await post.save();

//         res.status(200).json({
//             success: true,
//             message: "Post removed from favourites successfully",
//             data: post,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
// exports.searchPostByTags = async (req, res) => {
//     try {
//         const { tag } = req.query;
  
//       if (!tag) {
//         return res.status(400).json({
//           success: false,
//           message: "Please provide a tag to search for",
//         });
//       }
  
//       const posts = await Post.find({ tags: { $regex: tag, $options: "i" } });
  
//       if (posts.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "No posts found with the provided tag",
//         });
//       }
  
//       res.status(200).json({
//         success: true,
//         data: posts,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   };
//   exports.getFavouritePosts = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const user = await User.findById(userId).populate({
//             path: "favourites", // Populate posts
//             select: "-__v", // Exclude version key
//         });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Favourite posts fetched successfully",
//             data: user.favourites,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
// exports.filterPostsByTags = async (req, res) => {
//     try {
//         const { tags } = req.query; 

//         if (!tags || tags.trim() === "") {
//             return res.status(400).json({ success: false, message: "No tags provided" });
//         }

//         const tagArray = tags.split(",").map(tag => tag.trim());

//         // Check if MongoDB schema has tags as an array
//         const posts = await Post.find({ tags: { $in: tagArray } });


//         if (posts.length === 0) {
//             return res.status(404).json({ success: false, message: "No posts found with the given tags" });
//         }

//         res.status(200).json({ success: true, data: posts });
//     } catch (error) {
//         console.error("❌ ERROR in filterPostsByTags:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
// };




// exports.updatePost = async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         let post = await Post.findById(req.params.id);
        
//         if (!post) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found"
//             });
//         }
        
//         let updatedContent = post.content;
        
//         if (req.files && req.files.length > 0) {
//             for (let file of req.files) {
//                 let uploadedFile;
//                 if (file.mimetype.startsWith("image")) {
//                     uploadedFile = await cloudinary.uploader.upload(file.path, { folder: "posts/images" });
//                 } else if (file.mimetype.startsWith("video")) {
//                     uploadedFile = await cloudinary.uploader.upload(file.path, { folder: "posts/videos", resource_type: "video" });
//                 }
                
//                 if (uploadedFile) {
//                     let mediaType = file.mimetype.startsWith("image") ? "image" : "video";
//                     let mediaObject = {
//                         [mediaType]: {
//                             [`${mediaType}_url`]: uploadedFile.secure_url
//                         }
//                     };
//                     updatedContent.push(mediaObject);
//                 }
//             }
//         }
        
//         if (content) {
//             updatedContent = [...updatedContent, ...JSON.parse(content)];
//         }
        
//         post = await Post.findByIdAndUpdate(req.params.id, { title, content: updatedContent }, { new: true, runValidators: true });
        
//         res.status(200).json({
//             success: true,
//             data: post
//         });
//     } catch (e) {
//         res.status(500).json({
//             success: false,
//             message: e.message
//         });
//     }
// };




// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");

// // Multer storage configuration
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// exports.createPost = async (req, res) => {
//   try {
//     console.log("createpost me hu bhai");

//     const { title } = req.body;
//     const content = JSON.parse(req.body.content);
//     const userId = req.user.id; // Assuming user is authenticated

//     console.log("title,content:", title, content);
//     console.log("Uploaded files:", req.files);

//     if (!title || !content || !Array.isArray(content)) {
//       return res.status(400).json({ message: "Title and content are required!" });
//     }

//     let processedContent = [];
//     let fileIndex = 0;

//     for (let i = 0; i < content.length; i++) {
//       let item = content[i];
//       let newItem = {};

//       if (item.type === "text") {
//         newItem = {
//           type: "text",
//           para: item.content,
//         };
//       } else if (item.type === "image" || item.type === "video") {
//         if (!req.files || req.files.length <= fileIndex) {
//           return res.status(400).json({ message: "No files uploaded!" });
//         }

//         const file = req.files[fileIndex++];

//         const result = await new Promise((resolve, reject) => {
//           cloudinary.uploader.upload_stream(
//             { resource_type: item.type === "image" ? "image" : "video" },
//             (error, result) => {
//               if (error) reject(error);
//               else resolve(result);
//             }
//           ).end(file.buffer);
//         });

//         newItem = {
//           type: item.type,
//           url: result.secure_url,
//         };
//       } else {
//         return res.status(400).json({ message: "Invalid content type" });
//       }

//       processedContent.push(newItem);
//     }

//     console.log("Processed content:", processedContent);
//     res.status(201).json({ message: "Post created successfully", processedContent });
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
















const Post = require("../models/postModel");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
const { asyncHandler } = require("../middlewares/errorHandler");

// Create Post
exports.createPost = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required"
    });
  }

  let content = [];
  
  try {
    content = JSON.parse(req.body.content || "[]");
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid content format"
    });
  }

  let processedContent = [];
  let fileIndex = 0;

  for (let item of content) {
    let newItem = {};

    if (item.type === "text") {
      newItem = {
        type: "text",
        para: item.content
      };
    } else if (item.type === "image" || item.type === "video") {
      if (!req.files || req.files.length <= fileIndex) {
        return res.status(400).json({ 
          success: false,
          message: "File missing for media content" 
        });
      }

      const file = req.files[fileIndex++];

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: item.type === "image" ? "image" : "video",
            folder: "bloggy/posts"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      newItem = {
        type: item.type,
        url: result.secure_url
      };
    }

    processedContent.push(newItem);
  }

  const post = await Post.create({
    title,
    user: userId,
    content: processedContent
  });

  await User.findByIdAndUpdate(userId, {
    $push: { posts: post._id }
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: post
  });
});

// Get All Posts with Pagination
exports.getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "-createdAt";

  const posts = await Post.find()
    .populate("user", "name profile_pic")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments();

  res.status(200).json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// Get Post By ID
exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("user", "name profile_pic")
    .populate({
      path: "comments",
      populate: { path: "user", select: "name profile_pic" }
    })
    .populate("likes.user", "name")
    .populate("dislikes.user", "name");

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found"
    });
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// Delete Post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found"
    });
  }

  // Check if user owns the post
  if (post.user.toString() !== req.user.id && req.user.status !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this post"
    });
  }

  await Post.findByIdAndDelete(req.params.id);
  await User.findByIdAndUpdate(post.user, { 
    $pull: { posts: req.params.id } 
  });

  res.status(200).json({
    success: true,
    message: "Post deleted successfully"
  });
});

// Like Post
exports.likePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found"
    });
  }

  const alreadyLiked = post.likes.some(like => like.user.toString() === userId);
  
  if (alreadyLiked) {
    return res.status(400).json({
      success: false,
      message: "You have already liked this post"
    });
  }

  post.dislikes = post.dislikes.filter(dislike => dislike.user.toString() !== userId);
  post.likes.push({ user: userId });
  
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post liked successfully",
    data: post
  });
});

// Dislike Post
exports.dislikePost = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found"
    });
  }

  const alreadyDisliked = post.dislikes.some(dislike => dislike.user.toString() === userId);
  
  if (alreadyDisliked) {
    return res.status(400).json({
      success: false,
      message: "You have already disliked this post"
    });
  }

  post.likes = post.likes.filter(like => like.user.toString() !== userId);
  post.dislikes.push({ user: userId });
  
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post disliked successfully",
    data: post
  });
});

// Add to Favourites
exports.addPostToFavourites = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.id;

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!user || !post) {
    return res.status(404).json({
      success: false,
      message: "User or Post not found"
    });
  }

  if (user.favourites.includes(postId)) {
    return res.status(400).json({
      success: false,
      message: "Post already in favourites"
    });
  }

  user.favourites.push(postId);
  await user.save();

  post.favourited_by.push({ user: userId });
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post added to favourites",
    data: post
  });
});

// Remove from Favourites
exports.removePostFromFavourites = asyncHandler(async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.id;

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!user || !post) {
    return res.status(404).json({
      success: false,
      message: "User or Post not found"
    });
  }

  user.favourites = user.favourites.filter(id => id.toString() !== postId);
  await user.save();

  post.favourited_by = post.favourited_by.filter(fav => fav.user.toString() !== userId);
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post removed from favourites",
    data: post
  });
});

// Get Favourite Posts
exports.getFavouritePosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const user = await User.findById(userId).populate({
    path: "favourites",
    select: "-__v",
    populate: { path: "user", select: "name profile_pic" }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    data: user.favourites
  });
});

// Filter Posts by Tags
exports.filterPostsByTags = asyncHandler(async (req, res) => {
  const { tags } = req.query;

  if (!tags || tags.trim() === "") {
    return res.status(400).json({ 
      success: false, 
      message: "No tags provided" 
    });
  }

  const tagArray = tags.split(",").map(tag => tag.trim());
  const posts = await Post.find({ tags: { $in: tagArray } })
    .populate("user", "name profile_pic")
    .lean();

  if (posts.length === 0) {
    return res.status(404).json({ 
      success: false, 
      message: "No posts found with the given tags" 
    });
  }

  res.status(200).json({ 
    success: true, 
    data: posts 
  });
});

// Search Posts
exports.searchPosts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search query is required"
    });
  }

  const posts = await Post.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } }
    ]
  })
    .populate("user", "name profile_pic")
    .lean();

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});