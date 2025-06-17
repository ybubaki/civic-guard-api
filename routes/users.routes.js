const express = require("express");
const { adminMiddleware } = require("../middlewares/auth.middleware");
const { getAllUsers } = require("../controllers/user.controller");

const router = express.Router();

router.get("/", adminMiddleware, getAllUsers);

module.exports = router;
