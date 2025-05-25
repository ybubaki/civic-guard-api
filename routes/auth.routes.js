const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);

module.exports = router;
