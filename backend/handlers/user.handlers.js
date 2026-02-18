const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secret = process.env.MY_SECRET;

// register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;  // 👈 profileImage bhi lo

    if (!name || !email || !password) {
      return res.status(400).json({ isSuccess: false, message: "All fields required" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({ isSuccess: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // User create karo with profileImage
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      profileImage: profileImage || ''  // 👈 Agar image hai to save karo, nahi to empty string
    });

    console.log("✅ User registered:", {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage  // 👈 Check karo image save hui ya nahi
    });

    // Payload mein profileImage bhi bhejo
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage  // 👈 ADD - token mein bhi image URL
    };

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    res.status(201).json({
      isSuccess: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        profileImage: user.profileImage  // 👈 ADD - response mein bhi image URL
      },
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ isSuccess: false, message: "Internal server error" });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ isSuccess: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ isSuccess: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ isSuccess: false, message: "Invalid credentials" });
    }

    // Payload mein profileImage bhi bhejo
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage  // 👈 ADD - token mein image URL
    };

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    console.log("✅ User logged in:", {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage  // 👈 Check karo
    });

    res.json({
      isSuccess: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        profileImage: user.profileImage  // 👈 ADD - response mein bhi
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ isSuccess: false, message: "Internal server error" });
  }
};

// Get current user (optional - useful for frontend)
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;  // Auth middleware se aayega

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ isSuccess: false, message: "User not found" });
    }

    res.json({
      isSuccess: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error("❌ Get user error:", error);
    res.status(500).json({ isSuccess: false, message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser };