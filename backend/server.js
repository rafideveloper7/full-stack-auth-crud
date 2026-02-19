const express = require("express");
require("dotenv").config();

const { connectDB } = require("./db/db.js");
const userRouter = require("./routes/user.routes.js");
const todoRouter = require("./routes/todo.routes.js");

const app = express();

// ✅ DIRECT HEADERS SET KARO - CORS package ki zaroorat nahi
app.use((req, res, next) => {
  // Allow all origins temporarily for debugging
  res.header("Access-Control-Allow-Origin", "https://todoapi-wine.vercel.app");
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Origin", "*"); // Sirf testing ke liye
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    console.log("✅ OPTIONS request received");
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// --- DATABASE ---
connectDB().then(() => {
  console.log("Database connected successfully");
}).catch(err => {
  console.error("Database connection failed:", err);
});

// --- ROUTES ---
app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

// Test endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Backend is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
  res.json({ 
    message: "API is running",
    mode: process.env.NODE_ENV === "production" ? "Vercel/Production" : "Local/Dev",
    endpoints: {
      health: "/api/health",
      user: "/api/user",
      todo: "/api/todo"
    }
  });
});

// 404 handler
app.use((req,res) => {
  res.status(404).send({
    isSuccess: false,
    message: `page not found 404`
  });
});

// --- SERVER START ---
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local server: http://localhost:${PORT}`);
  });
}

module.exports = app;