const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const { asyncHandler } = require("../middlewares/errorHandler");

// Create Comment
exports.createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const user = req.user?.id;
  const post = req.params.id;

  if (!content || content.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Comment content is required"
    });
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Please sign in to comment"
    });
  }

  if (!post) {
    return res.status(400).json({
      success: false,
      message: "Post ID is required"
    });
  }

  const comment = await Comment.create({ content, user, post });

  await User.findByIdAndUpdate(user, { 
    $push: { comments: comment._id } 
  });
  
  await Post.findByIdAndUpdate(post, { 
    $push: { comments: comment._id } 
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate("user", "name profile_pic");

  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    data: populatedComment
  });
});

// Update Comment
exports.updateComment = asyncHandler(async (req, res) => {
  const { commentId, content } = req.body;

  if (!commentId || !content) {
    return res.status(400).json({
      success: false,
      message: "Comment ID and content are required"
    });
  }

  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this comment"
    });
  }

  comment.content = content;
  await comment.save();

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: comment
  });
});

// Upvote Comment
exports.upvoteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  if (!commentId) {
    return res.status(400).json({
      success: false,
      message: "Comment ID is required"
    });
  }

  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  const userId = req.user.id;

  // Remove from downvotes if present
  comment.downvotes = comment.downvotes.filter(
    id => id.toString() !== userId
  );

  // Add to upvotes if not already upvoted
  if (!comment.upvotes.includes(userId)) {
    comment.upvotes.push(userId);
  }

  await comment.save();

  res.status(200).json({
    success: true,
    message: "Comment upvoted",
    data: comment
  });
});

// Downvote Comment
exports.downvoteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  if (!commentId) {
    return res.status(400).json({
      success: false,
      message: "Comment ID is required"
    });
  }

  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  const userId = req.user.id;

  // Remove from upvotes if present
  comment.upvotes = comment.upvotes.filter(
    id => id.toString() !== userId
  );

  // Add to downvotes if not already downvoted
  if (!comment.downvotes.includes(userId)) {
    comment.downvotes.push(userId);
  }

  await comment.save();

  res.status(200).json({
    success: true,
    message: "Comment downvoted",
    data: comment
  });
});

// Delete Comment (Owner)
exports.deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  if (!commentId) {
    return res.status(400).json({
      success: false,
      message: "Comment ID is required"
    });
  }

  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this comment"
    });
  }

  await Comment.findByIdAndDelete(commentId);
  await Post.findByIdAndUpdate(comment.post, { 
    $pull: { comments: commentId } 
  });
  await User.findByIdAndUpdate(comment.user, { 
    $pull: { comments: commentId } 
  });

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully"
  });
});

// Delete Comment (Admin)
exports.deleteCommentAdmin = asyncHandler(async (req, res) => {
  const { commentId } = req.body;

  if (!commentId) {
    return res.status(400).json({
      success: false,
      message: "Comment ID is required"
    });
  }

  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  const userStatus = req.user?.status;
  
  if (userStatus !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin privileges required"
    });
  }

  await Comment.findByIdAndDelete(commentId);
  await Post.findByIdAndUpdate(comment.post, { 
    $pull: { comments: commentId } 
  });
  await User.findByIdAndUpdate(comment.user, { 
    $pull: { comments: commentId } 
  });

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully"
  });
});