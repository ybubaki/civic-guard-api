const express = require("express");
const {
  registerUser,
  updateUser,
  loginUser,
  changePassword,
  sendOtp,
  forgotPassword,
  makeAdmin,
  getMe,
} = require("../controllers/auth.controller");
const {
  registerSchema,
  updateSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  sendOtpSchema,
} = require("../schemas/auth.schema");
const validateRequest = require("../middlewares/validateRequest");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/make-admin", authMiddleware, makeAdmin);

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
router.post("/send-otp", validateRequest(sendOtpSchema), sendOtp);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);

router.get("/me", authMiddleware, getMe);

module.exports = router;
