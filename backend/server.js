const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db/db.js");
const userRouter = require("./routes/user.routes.js");
const todoRouter = require("./routes/todo.routes.js");

const app = express();

// --- CORS ---
app.use(cors({
  origin: [
    "https://todoapi-wine.vercel.app/", 
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// REMOVE OR COMMENT OUT THIS LINE - it's causing the error
// app.options('*', cors());  // ← REMOVE THIS LINE

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

// Test endpoint to check if backend is reachable
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

app.use((req,res) => {
  res.status(404).send({
    isSuccess: false,
    message: `page not found 404`
  });
});

// --- EXECUTION LOGIC ---
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local server: http://localhost:${PORT}`);
  });
}

module.exports = app;