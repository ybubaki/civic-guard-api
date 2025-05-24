const express = require("express");
const validateRequest = require("../middlewares/validateRequest");
const { createIssue } = require("../controllers/issue.controller");
const { createIssueSchema } = require("../schemas/issue.schema");
const { upload } = require("../utils/helper");

const router = express.Router();

router.post(
  "/",
  upload.single("photo"),
  validateRequest(createIssueSchema),
  createIssue
);

module.exports = router;
