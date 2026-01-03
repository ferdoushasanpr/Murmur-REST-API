const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require("express");
const app = express();
const port = 3000;

// Import routes
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");
const murmurRouter = require("./routers/murmurRouter");
const followRouter = require("./routers/followRouter");

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/murmurs", murmurRouter);
app.use("/follows", followRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
