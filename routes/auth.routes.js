const express = require("express");
const {
  registerUser,
  updateUser,
  loginUser,
  changePassword,
} = require("../controllers/auth.controller");
const {
  registerSchema,
  updateSchema,
  loginSchema,
  changePasswordSchema,
} = require("../schemas/auth.schema");
const validateRequest = require("../middlewares/validateRequest");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.put(
  "/update",
  authMiddleware,
  validateRequest(updateSchema),
  updateUser
);
router.post("/login", validateRequest(loginSchema), loginUser);
router.put(
  "/change-password",
  authMiddleware,
  validateRequest(changePasswordSchema),
  changePassword
);

module.exports = router;
