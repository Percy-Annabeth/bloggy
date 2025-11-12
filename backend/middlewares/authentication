const jwt = require("jsonwebtoken");

const JWT_SECRET="nooneshouldknowwhatmysecretkeyis";
exports.generateToken = (user)=>{
    const payload={
        id:user._id,
        name:user.name,
        email:user.email,
        status:user.status,
    };
    return jwt.sign(payload,JWT_SECRET,{expiresIn:"5d"});
};
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authorization token is required to access this route",
        });
    }

    try {
        const decoded_data = jwt.verify(token, JWT_SECRET);
        req.user = decoded_data; // Assign the decoded token payload to req.user
        next(); // Call next() to proceed to the next middleware
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};

exports.checkAdmin = (req, res, next) => {
    if (req.user?.status !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
  };

