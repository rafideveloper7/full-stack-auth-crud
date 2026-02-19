const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secret = process.env.MY_SECRET;

// ✅ REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    console.log("📝 Register request:", { 
      name, 
      email, 
      profileImage: profileImage ? "✅ Provided" : "❌ Not provided" 
    });

    if (!name || !email || !password) {
      return res.status(400).json({ 
        isSuccess: false, 
        message: "All fields required" 
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({ 
        isSuccess: false, 
        message: "User already exists" 
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      profileImage: profileImage || ''
    });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    };

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    res.status(201).json({
      isSuccess: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ 
      isSuccess: false, 
      message: "Internal server error" 
    });
  }
};

// ✅ LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        isSuccess: false, 
        message: "Email and password required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        isSuccess: false, 
        message: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        isSuccess: false, 
        message: "Invalid credentials" 
      });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage
    };

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    res.json({
      isSuccess: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      isSuccess: false, 
      message: "Internal server error" 
    });
  }
};

// ✅ UPDATE USER PROFILE (NEW)
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { name, email, profileImage } = req.body;

    console.log("📝 Updating profile for user:", userId);
    console.log("Update data:", { name, email, profileImage });

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        isSuccess: false,
        message: "Name and email are required"
      });
    }

    // Check if email already exists for another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return res.status(409).json({
        isSuccess: false,
        message: "Email already in use by another account"
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        profileImage: profileImage || ''
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found"
      });
    }

    // Create new token with updated data
    const payload = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage
    };

    const newToken = jwt.sign(payload, secret, { expiresIn: "7d" });

    console.log("✅ Profile updated successfully:", {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });

    res.json({
      isSuccess: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage
      },
      token: newToken // Send new token with updated info
    });

  } catch (error) {
    console.error("❌ Profile update error:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Failed to update profile",
      error: error.message
    });
  }
};

// ✅ GET CURRENT USER
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        isSuccess: false, 
        message: "User not found" 
      });
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
    console.error("❌ Get current user error:", error);
    res.status(500).json({ 
      isSuccess: false, 
      message: "Internal server error" 
    });
  }
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = { 
  registerUser, 
  loginUser, 
  updateUserProfile,  
  getCurrentUser 
};