const { z } = require("zod");

const updateSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .optional(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .optional(),
    email: z.string().email("Invalid email address").optional(),
    role: z.enum(["user", "admin"]).optional(),
  }),
});

module.exports = {
  updateSchema,
};
