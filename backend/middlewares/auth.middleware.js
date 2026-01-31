// auth middelware for login authentic user

const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({
        isSuccess: false,
        message: "Access denied. No token provided",
      });
    }

    console.log("Auth Token received:", token.substring(0, 30) + "...");

    
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    
    console.log("Decoded JWT:", decoded);
    
    // Set BOTH req.user and req.userId for compatibility
    req.user = decoded;
    
    // Extract user ID - check different possible fields
    const userId = decoded.id || decoded._id || decoded.userId;
    console.log("Extracted userId:", userId);
    
    if (!userId) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid token: No user ID found",
      });
    }
    
    req.userId = userId; // This is what your todo controllers need
    
    console.log("Auth successful. userId set to:", req.userId);
    
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid token",
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        isSuccess: false,
        message: "Token expired",
      });
    }
    
    res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};

module.exports = { authMiddleware };