const express = require("express");
const {createUser,getUserById,getVisitorProfile,updateUser,toggleSubscription,signIn,signOut,resetPassword,} = require("../controllers/userController");
const {verifyToken} = require("../middlewares/authentication");


const router = express.Router();


router.post("/signup", createUser);
router.post("/login", signIn);
router.post("/signout", signOut);
router.get("/visitorprofile/:id",  getVisitorProfile);
router.get("/:userId/subscribe",verifyToken,toggleSubscription)
router.get("/profile/:id", verifyToken, getUserById);
router.post("/updateprofile/:id", verifyToken, updateUser);
router.post("/resetpassword", resetPassword);


module.exports = router;