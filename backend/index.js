const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const { errorHandler } = require("./middlewares/errorHandler");

require("dotenv").config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
  "http://localhost:5173",
  "https://onrender.com/blablablablablabla"
  ],
credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body Parser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bloggyDB";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(`✅ MongoDB connected successfully to ${MONGODB_URI}`);
})
.catch((error) => {
  console.error("❌ MongoDB connection error:", error);
  process.exit(1);
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Bloggy API is running",
    timestamp: new Date().toISOString()
  });
});

// Home Route
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Bloggy API</h1>
    <p>Server is running on port ${PORT}</p>
    <p><a href="/api/health">Health Check</a></p>
  `);
});











const path = require("path");

// Serve Frontend Production Build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error Handler (must be last)
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Bloggy server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});