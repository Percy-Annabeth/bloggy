// backend/middlewares/validation.js

const validator = require("validator");

// Validate User Registration
exports.validateUserRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push("Name must be at least 3 characters long");
  }

  if (!email || !validator.isEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

// Validate Login
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

// Validate Post Creation
exports.validatePostCreation = (req, res, next) => {
  const { title } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Post title is required");
  }

  if (title && title.length > 200) {
    errors.push("Title cannot exceed 200 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

// Validate Comment Creation
exports.validateCommentCreation = (req, res, next) => {
  const { content } = req.body;
  const errors = [];

  if (!content || content.trim().length === 0) {
    errors.push("Comment content is required");
  }

  if (content && content.length > 1000) {
    errors.push("Comment cannot exceed 1000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};