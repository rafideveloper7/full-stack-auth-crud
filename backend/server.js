const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db/db.js");
const userRouter = require("./routes/user.routes.js");
const todoRouter = require("./routes/todo.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

connectDB();

app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Only start a server for local dev
// if (!isVercel) {
//   app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
//   });
// }

module.exports = app;
