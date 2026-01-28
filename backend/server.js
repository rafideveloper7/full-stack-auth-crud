const express = require("express");
const app = express();
require("dotenv").config();
// control errors while both fronend and backend local servers live
const cors = require("cors");
app.use(cors());

const PORT = 5000;

app.use(express.json());

const { connectDB } = require("./db/db.js");
const router = require("./routes/user.routes.js");
connectDB();

app.use("/api", router);
app.get("/", (req, res) => {
  res.send("welcome to Full-Stack todo api");
});

app.listen(PORT, () => {
  console.log(`server is up on localhost:${PORT}`);
});
