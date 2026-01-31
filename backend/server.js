const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db/db.js");
const userRouter = require("./routes/user.routes.js");
const todoRouter = require("./routes/todo.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const PORT = process.env.PORT || 5000;

const BASE_URL = isVercel
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${PORT}`;

connectDB();

app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

app.get("/api", (req, res) => {
  res.json({
    isSuccess: true,
    message: "welcome to Full-Stack todo api",
    baseApi: BASE_URL,
    todos: `${BASE_URL}/api/todo`,
    createTodo: `${BASE_URL}/api/todo`,
    updateTodo: `${BASE_URL}/api/todo/:id`,
    deleteTodo: `${BASE_URL}/api/todo/:id`
  });
});

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
