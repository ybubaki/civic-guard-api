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
    rating: z
      .number()
      .min(0, "Rating must be at least 0")
      .max(5, "Rating must be at most 5")
      .optional(),
    active: z.enum(["true", "false"]).optional(),
  }),
});

module.exports = {
  updateSchema,
};
