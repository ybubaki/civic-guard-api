const express = require("express");
const { adminMiddleware } = require("../middlewares/auth.middleware");
const { getAllUsers, updateUser } = require("../controllers/user.controller");
const { updateSchema } = require("../schemas/user.schema");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get("/", adminMiddleware, getAllUsers);
router.put(
  "/update/:id",
  adminMiddleware,
  validateRequest(updateSchema),
  updateUser
);

module.exports = router;
