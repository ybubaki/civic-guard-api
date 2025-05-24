const express = require("express");
const path = require("path");
const routes = require("./routes/index");

require("dotenv").config();

const app = express();

// Serve files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

module.exports = app;
