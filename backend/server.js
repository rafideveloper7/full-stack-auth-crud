const express = require("express");
const app = express();
require("dotenv").config();
// control errors while both fronend and backend local servers live
const cors = require("cors");
app.use(cors());

const PORT = 5000;

app.use(express.json());

// const { authMiddleware } = require("./middlewares/auth.middleware.js");
const { connectDB } = require("./db/db.js");
const userRouter = require("./routes/user.routes.js");
const todoRouter = require("./routes/todo.routes.js");

connectDB();

app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);
app.get("/api", (req, res) => {
  res.send({
    isSuccess: true,
    message: "welcome to Full-Stack todo api",
    baseApi: "http://localhost:5000/",
    Todos: "http://localhost:5000/api/todo",
    deleteTodo: "http://localhost:5000/api/todo/id",
    createImageBitmapTodo: "http://localhost:5000/api/todo/id",
    updateTodo: "http://localhost:5000/api/todo/id",
  });
});

// coment for vercel
app.listen(PORT, () => {
  console.log(`server is up on localhost:${PORT}`);
});

// for vercel deploy 
// module.exports = app;
