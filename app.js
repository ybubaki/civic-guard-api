const express = require("express");
const path = require("path");
const routes = require("./routes/index");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*" }));

// Serve files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

module.exports = app;
