const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");

// Routes
app.get("/test", (req, res) => {
    res.send("hello world!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});