const express = require("express");
const app = express();
require("dotenv").config();
// control errors while both fronend and backend local servers live
const cors = require("cors");
app.use(cors());

const PORT = 5000;

app.use(express.json());

const { authMiddleware } = require("./middlewares/auth.middleware.js");
const { connectDB } = require("./db/db.js");
const userRouter = require("./routes/user.routes.js");
const todoRouter = require("./routes/todo.routes.js");

connectDB();

app.use("/api", userRouter);
app.use("/todo", todoRouter)
app.get("/", (req, res) => {
  res.send("welcome to Full-Stack todo api");
});

// coment for vercel
app.listen(PORT, () => {
  console.log(`server is up on localhost:${PORT}`);
});

// for vercel deploy 
// module.exports = app;