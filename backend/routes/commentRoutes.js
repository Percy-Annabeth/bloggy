const express = require("express");
const {createComment,updateComment,upvoteComment,downvoteComment,deleteComment,deleteCommentAdmin} = require("../controllers/commentController");
const { verifyToken, checkAdmin } = require("../middlewares/authentication");

const router = express.Router();

router.post("/create/:id", verifyToken, createComment);
router.put("/update", verifyToken, updateComment);
router.put("/upvote", verifyToken, upvoteComment);
router.put("/downvote", verifyToken, downvoteComment);
router.delete("/delete", verifyToken, deleteComment);

router.delete("/admin/delete", verifyToken, checkAdmin, deleteCommentAdmin);

module.exports = router;