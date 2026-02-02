const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db/db.js");
const userRouter = require("./routes/user.routes.js");
const todoRouter = require("./routes/todo.routes.js");

const app = express();

// --- CORS ---
app.use(cors({
  origin: ["https://frontend-crud-liart.vercel.app", "http://localhost:5173"],
  credentials: true,
}));

app.use(express.json());

// --- DATABASE ---
// We call connectDB but don't let a failure crash the entire process immediately
connectDB().then(() => {
  console.log("Database connected successfully");
}).catch(err => {
  console.error("Database connection failed:", err);
});

// --- ROUTES ---
app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

app.get("/", (req, res) => {
  res.json({ 
    message: "API is running",
    mode: process.env.NODE_ENV === "production" ? "Vercel/Production" : "Local/Dev"
  });
});

// --- EXECUTION LOGIC ---
// If we are NOT on Vercel, we need to manually call app.listen
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Local server: http://localhost:${PORT}`);
//   });
// }

// Export for Vercel
module.exports = app;