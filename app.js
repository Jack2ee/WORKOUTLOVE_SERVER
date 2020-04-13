const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const routineRoutes = require("./routes/routine");

const MONGODB_TEST_URL = "mongodb://127.0.0.1:27017/test";

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
// app.use("/routine", routineRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_TEST_URL)
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
