const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) throw new Error("MONGODB_URL not defined");

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
      maxPoolSize: 10
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connected:", cached.conn.connection.host);
  return cached.conn;
};

module.exports = { connectDB };
