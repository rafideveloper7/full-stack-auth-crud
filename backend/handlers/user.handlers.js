const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secret = process.env.MY_SECRET;

// register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ isSuccess: false, message: "All fields required" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({ isSuccess: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const payload = {
      name, email
    }

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    res.status(201).json({
      isSuccess: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
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
    const payload = {
      email,
      id: user._id,
      name: user.name
    }

    const token = jwt.sign(payload, secret, { expiresIn: "7d" });

    res.json({
      isSuccess: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser };
