// auth middelware for login authentic user
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const secret = process.env.MY_SECRET;
    if (!token) {
      return res.status(401).json({
        isSuccess: false,
        message: "Access denied. No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.MY_SECRET);

    req.user = decoded; // make user data available in next controllers

    next(); // go to next handler
  } catch (error) {
    console.log(error);
    res.status(500).send({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};

module.exports = { authMiddleware };
