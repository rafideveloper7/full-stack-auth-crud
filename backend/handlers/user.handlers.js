const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// require('dotenv').config();

const secret = process.env.MY_SECRET;

// register new user
// public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        isSuccess: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "7d",
    });

    res.status(201).json({
      isSuccess: true,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};

// login user
// public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        isSuccess: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "7d",
    });

    res.json({
      isSuccess: true,
      token,
    });
  } catch (error) {
    res.status(500).send({
      isSuccess: false,
      message: "internal server error",
    });
  }
};

// get user
// authentic
const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).send({
      isSuccess: true,
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      isSuccess: true,
      message: "Internal server error!",
    });
  }
};

module.exports = { registerUser, loginUser, getUser };
