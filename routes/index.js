const express = require("express");
const authRoutes = require("./auth.routes");
const issuesRoutes = require("./issues.routes");
const chatRoutes = require("./chat.routes");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/issues", authMiddleware, issuesRoutes);
router.use("/chat", authMiddleware, chatRoutes);

module.exports = router;
