const express = require("express");
const {
  createPost,
  deletePost,
  getPostById,
  removePostFromFavourites,
  getFavouritePosts,
  filterPostsByTags,
  getAllPosts,
  likePost,
  dislikePost,
  addPostToFavourites,
  searchPosts  // ← Changed from searchPostByTags to searchPosts
} = require("../controllers/postController");
const { verifyToken } = require("../middlewares/authentication");
const upload = require("../middlewares/multer");

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/search", searchPosts);  // ← Fixed: using searchPosts instead
router.get("/filter", filterPostsByTags);
router.get("/:id", getPostById);

// Protected routes
router.get("/favourites", verifyToken, getFavouritePosts);

router.post("/createpostbyuser/:id", verifyToken, upload.array("files", 10), createPost);

router.delete("/:id", verifyToken, deletePost);
router.put("/:id/like", verifyToken, likePost);
router.put("/:id/dislike", verifyToken, dislikePost);
router.put("/:id/addfavourite", verifyToken, addPostToFavourites);
router.put("/:id/remfavourite", verifyToken, removePostFromFavourites);

module.exports = router;