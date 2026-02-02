const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db/db.js");
const userRouter = require("./routes/user.routes.js");
const todoRouter = require("./routes/todo.routes.js");

const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: "https://frontend-crud-liart.vercel.app", // frontend URL
    credentials: true,
  }),
);
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = app;
