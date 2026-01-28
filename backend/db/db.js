const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL not found in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URL, {

    });

    console.log("MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = {connectDB};