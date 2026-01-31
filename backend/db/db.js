const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

// Stop app immediately if DB URL missing
if (!MONGODB_URL) {
  throw new Error("MONGODB_URL not found in environment variables");
}

// global is used so connection survives across function calls in serverless
let cached = global.mongoose;

// First time the app runs, create cache object
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If connection already exists, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is not created yet, start creating it
  // Store promise so multiple requests don't create multiple connections at same time
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false, // don't buffer if not connected
      maxPoolSize: 10        // limit connections (important for serverless)
    }).then((mongoose) => mongoose);
  }

  // Wait for connection to finish and store it
  cached.conn = await cached.promise;

  console.log("MongoDB connected:", cached.conn.connection.host);

  return cached.conn;
};

module.exports = { connectDB };
