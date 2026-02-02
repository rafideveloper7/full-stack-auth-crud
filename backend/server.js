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

// ... existing imports

// Root route providing API documentation for Frontend Devs
app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.json({
    message: "Welcome to the Full-Stack Auth CRUD API",
    status: "Active",
    documentation: {
      auth_endpoints: {
        register: {
          method: "POST",
          url: `${baseUrl}/api/user/register`,
          body: { name: "string", email: "string", password: "string" },
        },
        login: {
          method: "POST",
          url: `${baseUrl}/api/user/login`,
          body: { email: "string", password: "string" },
        },
      },
      todo_endpoints: {
        get_all: {
          method: "GET",
          url: `${baseUrl}/api/todo`,
        },
        create: {
          method: "POST",
          url: `${baseUrl}/api/todo`,
          body: { title: "string", description: "string" },
        },
      },
    },
  });
});

// ... rest of your routes and module.exports

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = app;
