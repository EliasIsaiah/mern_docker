require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use("/api/places/", placesRoutes);
app.use("/api/users/", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

const path = require("path");

// Routes
app.get("/test", (req, res) => {
  res.send("hello world!");
});

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
      console.log(`Mongo connection established! 💻`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
