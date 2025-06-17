const express = require("express");
const authRoutes = require("./auth.routes");
const issuesRoutes = require("./issues.routes");
const chatRoutes = require("./chat.routes");
const usersRoutes = require("./users.routes");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/issues", authMiddleware, issuesRoutes);
router.use("/chat", authMiddleware, chatRoutes);
router.use("/users", authMiddleware, usersRoutes);

module.exports = router;
