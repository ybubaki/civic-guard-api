const express = require("express");
const authRoutes = require("./auth.routes");
const issuesRoutes = require("./issues.routes");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/issues", authMiddleware, issuesRoutes);

module.exports = router;
