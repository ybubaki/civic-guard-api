const express = require("express");
const userRoutes = require("./user.routes");
const issuesRoutes = require("./issues.routes");
const router = express.Router();

router.use("/users", userRoutes);
router.use("/issues", issuesRoutes);

module.exports = router;
