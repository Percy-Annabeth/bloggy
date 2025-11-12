const Post = require("../models/postModel");
const User = require("../models/userModel");
// const cloudinary = require("../cloudinary");

// exports.createPost = async (req,res)=>{
//     try{
//         const {title,content} = req.body;
//         const userId = req.params.id;
//         const post = await Post.create({title,user:userId,content});
//         await User.findByIdAndUpdate(userId,{
//             $push:{
//                 posts:post._id,
//             }
//         })
//         res.status(201).json({
//             success:true,
//             data:post,
//         });
//     }
//     catch(e){
//         res.status(400).json({
//             success:false,
//             message:e.message,
//         });
//     }
// };
// exports.updatePost = async (req,res)=>{
//     try{
//         const {title,user,content} = req.body;
//         const post = await Post.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true, 
//         });
//         if(!post){
//             res.status(404).json({
//                 success:false,
//                 message:"Post not found",
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
exports.deletePost = async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
      await User.findByIdAndUpdate(post.user, { $pull: { posts: req.params.id } });

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
exports.getPostById = async (req,res)=>{
    try{

        const post = await Post.findByIdAndUpdate(req.params.id,{$inc:{views:1}},{new:true})
        .populate("likes")
        .populate("dislikes")
        .populate("favourited_by")
        .populate("user","name")
        .populate("comments");
        // .populate("views");
        if(!post){
            res.status(404).json({
                success:false,  
                message:"post not found",
            });
        }
        res.status(200).json({
            success:true,
            data:post,
        });
    }
    catch(e){
        res.status(500).json({
            success:false,
            message:e.message,
        });
    }
};
exports.getAllPosts = async (req,res)=>{

    try{
        const posts = await Post.find();

        res.status(200).json({
            success:true,
            posts,
        });
    }
    catch(e){
        res.status(500).json({
            success:false,
            message:e.message,
        });
    }
};
exports.likePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user.id;
  
        const post = await Post.findById(postId);
        if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found",
            });
        }
        if (post.likes.some((like) => like.user.toString() === userId)) {
        return res.status(400).json({
            success: false,
            message: "You have already liked this post!",
            });
        }
        post.dislikes = post.dislikes.filter((dislike) => dislike.user.toString() !== userId);
        post.likes.push({ user: userId });
        await post.save();
  
        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            data: post,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
  };
exports.dislikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user.id;
        const post = await Post.findById(postId);
        if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found",
        });
        }
        if (post.dislikes.some((dislike) => dislike.user.toString() === userId)) {
        return res.status(400).json({
            success: false,
            message: "You have already disliked this post!",
        });
        }
        post.likes = post.likes.filter((like) => like.user.toString() !== userId);
        post.dislikes.push({ user: userId });
        await post.save();
  
        res.status(200).json({
            success: true,
            message: "Post disliked successfully",
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
      });
    }
  };
exports.addPostToFavourites = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user.id;
  
        const user = await User.findById(userId);
        const post = await Post.findById(postId);
  
        if (!user || !post) {
           return res.status(404).json({
                success: false,
                message: "User or Post not found",
            });
        }
        if (user.favourites.includes(postId)) {
            return res.status(400).json({
                success: false,
                message: "Post already in favourites",
            });
        }
  
        user.favourites.push(postId);
        await user.save();
  
        post.favourited_by.push({ user: userId });
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post added to favourites successfully",
            data: post,

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
      });
    }
};
exports.removePostFromFavourites = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const post = await Post.findById(postId);

        if (!user || !post) {
            return res.status(404).json({
                success: false,
                message: "User or Post not found",
            });
        }

        // Check if the post is in user's favourites
        if (!user.favourites.includes(postId)) {
            return res.status(400).json({
                success: false,
                message: "Post is not in favourites",
            });
        }

        // Remove post from user's favourites list
        user.favourites = user.favourites.filter((favId) => favId.toString() !== postId);
        await user.save();

        // Remove user from post's favourited_by array
        post.favourited_by = post.favourited_by.filter((fav) => fav.user.toString() !== userId);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post removed from favourites successfully",
            data: post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.searchPostByTags = async (req, res) => {
    try {
        const { tag } = req.query;
  
      if (!tag) {
        return res.status(400).json({
          success: false,
          message: "Please provide a tag to search for",
        });
      }
  
      const posts = await Post.find({ tags: { $regex: tag, $options: "i" } });
  
      if (posts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No posts found with the provided tag",
        });
      }
  
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  exports.getFavouritePosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate({
            path: "favourites", // Populate posts
            select: "-__v", // Exclude version key
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Favourite posts fetched successfully",
            data: user.favourites,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.filterPostsByTags = async (req, res) => {
    try {
        const { tags } = req.query; 

        if (!tags || tags.trim() === "") {
            return res.status(400).json({ success: false, message: "No tags provided" });
        }

        const tagArray = tags.split(",").map(tag => tag.trim());

        // Check if MongoDB schema has tags as an array
        const posts = await Post.find({ tags: { $in: tagArray } });


        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found with the given tags" });
        }

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error("❌ ERROR in filterPostsByTags:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};







// exports.createPost = async (req, res) => {
//   try {
//     const { title, content, category, tags } = req.body;
//     const userId = req.params.id;

//     if (!title || !content || !category) {
//       return res.status(400).json({ success: false, message: "Title, content, and category are required!" });
//     }

//     // Process uploaded files
//     const mediaUrls: string[] = []; // Explicitly define as an array of strings
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const uploadResponse = await cloudinary.uploader.upload(file.path, {
//           resource_type: file.mimetype.startsWith("image") ? "image" : "video",
//           folder: "blog_posts", // Cloudinary folder
//         });
//         mediaUrls.push(uploadResponse.secure_url);
//       }
//     }

//     // Create post object
//     const newPost = new Post({
//       title,
//       user: userId,
//       content,
//       category,
//       tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
//       media: mediaUrls, // Store Cloudinary URLs
//     });

//     // Save the new post
//     await newPost.save();

//     // Link the post to the user
//     await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

//     res.status(201).json({ success: true, message: "Post created successfully!", data: newPost });
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({ success: false, message: "Failed to create post" });
//   }
// };

























// exports.createPost = async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         const userId = req.params.id;

//         let updatedContent = [];

//         // Handle file uploads
//         if (Array.isArray(req.files) && req.files.length > 0) {
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
//                         type: mediaType,
//                         content: {
//                             [`${mediaType}_url`]: uploadedFile.secure_url
//                         }
//                     };
//                     updatedContent.push(mediaObject);
//                 }
//             }
//         }

//         // Handle textual content correctly
//         let parsedContent;
//         if (typeof content === "string") {
//             try {
//                 parsedContent = JSON.parse(content); // Parse only if string
//             } catch (err) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid JSON format for content"
//                 });
//             }
//         } else if (Array.isArray(content)) {
//             parsedContent = content;
//         } else {
//             parsedContent = [];
//         }

//         // Merge content from request with uploaded media
//         updatedContent = [...updatedContent, ...parsedContent];

//         // Create new post
//         const post = await Post.create({ title, user: userId, content: updatedContent });

//         // Link post to user
//         await User.findByIdAndUpdate(userId, {
//             $push: { posts: post._id }
//         });

//         return res.status(201).json({
//             success: true,
//             data: post
//         });

//     } catch (e) {
//         console.error("Error creating post:", e);
//         return res.status(500).json({
//             success: false,
//             message: "Server error: " + e.message
//         });
//     }
// };











// exports.createPost = async (req, res) => {
//     try {
//         const { title, content } = req.body;
//         const userId = req.params.id;

//         let updatedContent = [];

//         // Handle file uploads (Images & Videos)
//         if (Array.isArray(req.files) && req.files.length > 0) {
//             for (let file of req.files) {
//                 let uploadedFile;
//                 if (file.mimetype.startsWith("image")) {
//                     uploadedFile = await cloudinary.uploader.upload(file.path, { folder: "bloggy/posts/images" });
//                 } else if (file.mimetype.startsWith("video")) {
//                     uploadedFile = await cloudinary.uploader.upload(file.path, { folder: "bloggy/posts/videos", resource_type: "video" });
//                 }

//                 if (uploadedFile) {
//                     let mediaType = file.mimetype.startsWith("image") ? "image" : "video";
//                     let mediaObject = {
//                         type: mediaType,
//                         content: {}
//                     };

//                     if (mediaType === "image") {
//                         mediaObject.content.image_url = uploadedFile.secure_url;
//                     } else {
//                         mediaObject.content.video_url = uploadedFile.secure_url;
//                     }

//                     updatedContent.push(mediaObject);
//                 }
//             }
//         }

//         // Handle Textual Content Correctly
//         let parsedContent = [];

//         if (typeof content === "string") {
//             try {
//                 parsedContent = JSON.parse(content);
//             } catch (err) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid JSON format for content"
//                 });
//             }
//         } else if (Array.isArray(content)) {
//             parsedContent = content;
//         }

//         // Ensure text content is properly formatted
//         parsedContent = parsedContent.map(item => {
//             if (item.type === "text" && typeof item.content === "string") {
//                 return {
//                     type: "text",
//                     content: { para: item.content }  // Ensure para is inside content object
//                 };
//             }
//             return item;
//         });

//         // Merge textual and media content
//         updatedContent = [...updatedContent, ...parsedContent];

//         // Create new post
//         const post = await Post.create({ title, user: userId, content: updatedContent });

//         // Link post to user
//         await User.findByIdAndUpdate(userId, {
//             $push: { posts: post._id }
//         });

//         return res.status(201).json({
//             success: true,
//             data: post
//         });

//     } catch (e) {
//         console.error("Error creating post:", e);
//         return res.status(500).json({
//             success: false,
//             message: "Server error: " + e.message
//         });
//     }
// };



exports.updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        let post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
        let updatedContent = post.content;
        
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                let uploadedFile;
                if (file.mimetype.startsWith("image")) {
                    uploadedFile = await cloudinary.uploader.upload(file.path, { folder: "posts/images" });
                } else if (file.mimetype.startsWith("video")) {
                    uploadedFile = await cloudinary.uploader.upload(file.path, { folder: "posts/videos", resource_type: "video" });
                }
                
                if (uploadedFile) {
                    let mediaType = file.mimetype.startsWith("image") ? "image" : "video";
                    let mediaObject = {
                        [mediaType]: {
                            [`${mediaType}_url`]: uploadedFile.secure_url
                        }
                    };
                    updatedContent.push(mediaObject);
                }
            }
        }
        
        if (content) {
            updatedContent = [...updatedContent, ...JSON.parse(content)];
        }
        
        post = await Post.findByIdAndUpdate(req.params.id, { title, content: updatedContent }, { new: true, runValidators: true });
        
        res.status(200).json({
            success: true,
            data: post
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};


























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












// const upload = require("../middlewares/multer");


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
//           para: item.chotacontent,
//         };
//       } else if (item.type === "image" || item.type === "video") {
//         const uploadResponse = await cloudinary.uploader.upload(item.chotacontent, {
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


























// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");

// // Multer storage configuration (storing files in memory for Cloudinary upload)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Import Post model
// // const Post = require("../models/postModel");

// exports.createPost = async (req, res) => {
//     console.log("createpost me hu bhai");
//   try {
//     const { title } = req.body;
//     const content = JSON.parse(req.body.content);

//     const userId = req.user.id; // Assuming user is authenticated
//     // const content = JSON.parse(req.body.content); // Parse JSON content metadata

//     console.log("title,content:",title,content);
//     console.log("Uploaded files:", req.files);


//     if (!title || !content || !Array.isArray(content)) {
//       return res.status(400).json({ message: "Title and content are required!" });
//     }

// //     let processedContent = [];
// // console.log(req.files,"req .files");
// //     for (let i = 0; i < content.length; i++) {
// //       let item = content[i];
// //       let newItem = {};

// //       if (item.type === "text") {
// //         newItem = {
// //           type: "text",
// //           para: item.chotacontent, // Directly store text content
// //         };
// //       } else if (item.type === "image" || item.type === "video") {
// //         if (!req.files || req.files.length === 0) {
// //             return res.status(400).json({ message: "No files uploaded!" });
// //           }
// //         const file = req.files.shift(); // Get the uploaded file
// //         if (!file) {
// //           return res.status(400).json({ message: "File is missing!" });
// //         }

// //         // Upload file to Cloudinary
// //         const result = await new Promise((resolve, reject) => {
// //           cloudinary.uploader.upload_stream(
// //             { resource_type: item.type === "image" ? "image" : "video" },
// //             (error, result) => {
// //               if (error) reject(error);
// //               else resolve(result);
// //             }
// //           ).end(file.buffer);
// //         });

// //         newItem = {
// //           type: item.type,
// //           url: result.secure_url, // Store Cloudinary URL
// //         };
// //       } else {
// //         return res.status(400).json({ message: "Invalid content type" });
// //       }

// //       processedContent.push(newItem);

// //       console.log("processesdcontent in fiu:",processedContent);
// //     }
// //     console.log("processesdcontent :",processedContent);

// //     // Save post in MongoDB
// //     const newPost = new Post({
// //       title,
// //       user: userId,
// //       content: processedContent,
// //     });


// //     console.log("post",Post);
// //         await newPost.save();
// //     res.status(201).json({ message: "Post created successfully!", post: newPost });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Internal Server Error" });




// let processedContent = [];
// let fileIndex = 0;

// for (let i = 0; i < content.length; i++) {
//   let item = content[i];
//   let newItem = {};

//   if (item.type === "text") {
//     newItem = {
//       type: "text",
//       para: item.chotacontent,
//     };
//   } else if (item.type === "image" || item.type === "video") {
//     if (!req.files || req.files.length <= fileIndex) {
//       return res.status(400).json({ message: "No files uploaded!" });
//     }

//     const file = req.files[fileIndex++];

//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { resource_type: item.type === "image" ? "image" : "video" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(file.buffer);
//     });

//     newItem = {
//       type: item.type,
//       url: result.secure_url,
//     };
//   } else {
//     return res.status(400).json({ message: "Invalid content type" });
//   }

//   processedContent.push(newItem);
// }

// console.log("Processed content:", processedContent);
// res.status(201).json({ message: "Post created successfully", processedContent });
// } catch (error) {
// console.error("Error creating post:", error);
// res.status(500).json({ message: "Internal Server Error" });
//   }
// };





const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.createPost = async (req, res) => {
  try {
    console.log("createpost me hu bhai");

    const { title } = req.body;
    const content = JSON.parse(req.body.content);
    const userId = req.user.id; // Assuming user is authenticated

    console.log("title,content:", title, content);
    console.log("Uploaded files:", req.files);

    if (!title || !content || !Array.isArray(content)) {
      return res.status(400).json({ message: "Title and content are required!" });
    }

    let processedContent = [];
    let fileIndex = 0;

    for (let i = 0; i < content.length; i++) {
      let item = content[i];
      let newItem = {};

      if (item.type === "text") {
        newItem = {
          type: "text",
          para: item.content,
        };
      } else if (item.type === "image" || item.type === "video") {
        if (!req.files || req.files.length <= fileIndex) {
          return res.status(400).json({ message: "No files uploaded!" });
        }

        const file = req.files[fileIndex++];

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: item.type === "image" ? "image" : "video" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        });

        newItem = {
          type: item.type,
          url: result.secure_url,
        };
      } else {
        return res.status(400).json({ message: "Invalid content type" });
      }

      processedContent.push(newItem);
    }

    console.log("Processed content:", processedContent);
    res.status(201).json({ message: "Post created successfully", processedContent });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
