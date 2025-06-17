const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  }),
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().min(4, "Otp must be at least 4 characters long"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  }),
});

const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

module.exports = {
  registerSchema,
  updateSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  sendOtpSchema,
};
