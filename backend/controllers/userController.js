const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middlewares/authentication");
const { asyncHandler } = require("../middlewares/errorHandler");

// Create User (Sign Up)
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({ 
    name, 
    email, 
    password: hashedPassword 
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile_pic: user.profile_pic,
      status: user.status
    }
  });
});

// Sign In
exports.signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile_pic: user.profile_pic,
      status: user.status
    }
  });
});

// Sign Out
exports.signOut = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

// Get User By ID (Own Profile)
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("posts")
    .populate("comments")
    .populate("favourites")
    .populate("reading_list")
    .populate("subscribers", "name profile_pic")
    .populate("subscribed", "name profile_pic")
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// Get Visitor Profile
exports.getVisitorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("name profile_pic subscribers posts")
    .populate({
      path: "posts",
      select: "title content createdAt views likes dislikes",
      options: { sort: { createdAt: -1 } }
    })
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// Get All Users (Admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password")
    .lean();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// Update User Profile
exports.updateUser = asyncHandler(async (req, res) => {
  const allowedUpdates = ["name", "profile_pic"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({
      success: false,
      message: "Invalid updates"
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user
  });
});

// Reset Password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email and new password are required"
    });
  }

  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No user found with this email"
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully"
  });
});

// Toggle Subscription
exports.toggleSubscription = asyncHandler(async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.user.id;

  if (targetUserId === currentUserId) {
    return res.status(400).json({
      success: false,
      message: "You cannot subscribe to yourself"
    });
  }

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const isSubscribed = targetUser.subscribers.includes(currentUserId);

  if (isSubscribed) {
    // Unsubscribe
    targetUser.subscribers = targetUser.subscribers.filter(
      id => id.toString() !== currentUserId
    );
    currentUser.subscribed = currentUser.subscribed.filter(
      id => id.toString() !== targetUserId
    );
    await targetUser.save();
    await currentUser.save();

    return res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
      isSubscribed: false
    });
  } else {
    // Subscribe
    targetUser.subscribers.push(currentUserId);
    currentUser.subscribed.push(targetUserId);
    await targetUser.save();
    await currentUser.save();

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully",
      isSubscribed: true
    });
  }
});

// Add to Reading List
exports.addToReadingList = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: "User not found" 
    });
  }

  if (user.reading_list.includes(postId)) {
    return res.status(400).json({
      success: false,
      message: "Post already in reading list"
    });
  }

  user.reading_list.push(postId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Post added to reading list"
  });
});

// Remove from Reading List
exports.removeFromReadingList = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: "User not found" 
    });
  }

  user.reading_list = user.reading_list.filter(
    id => id.toString() !== postId
  );
  await user.save();

  res.status(200).json({
    success: true,
    message: "Post removed from reading list"
  });
});