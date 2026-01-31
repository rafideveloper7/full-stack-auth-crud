const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL, {
    });
    console.log("MongoDB connected:", conn.connection.host);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = { connectDB };