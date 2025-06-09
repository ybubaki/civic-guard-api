const { z } = require("zod");

const createIssueSchema = z.object({
  body: z.object({
    description: z.string().min(1, "Description is required"),
    city: z.string().min(1, "City is required"),
    latitude: z.string().min(1, "Latitude is required"),
    longitude: z.string().min(1, "Longitude is required"),
  }),
});

const updateIssueSchema = z.object({
  body: z.object({
    description: z.string().optional(),
    city: z.string().optional(),
    status: z.string().optional(),
  }),
});

module.exports = {
  createIssueSchema,
  updateIssueSchema,
};
