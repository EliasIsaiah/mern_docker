require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places/", placesRoutes);
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
