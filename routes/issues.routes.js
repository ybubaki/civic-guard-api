const express = require("express");
const validateRequest = require("../middlewares/validateRequest");
const {
  createIssue,
  getIssues,
  getIssueById,
  getIssuesByUser,
  updateIssue,
  deleteIssue,
  searchIssues,
} = require("../controllers/issue.controller");
const {
  createIssueSchema,
  updateIssueSchema,
} = require("../schemas/issue.schema");
const { upload } = require("../utils/multer");

const router = express.Router();

router.post(
  "/",
  upload.single("photo"),
  validateRequest(createIssueSchema),
  createIssue
);

router.get("/", getIssues);

router.get("/user", getIssuesByUser);

router.get("/search", searchIssues);

router.get("/:id", getIssueById);

router.put("/:id", validateRequest(updateIssueSchema), updateIssue);

router.delete("/:id", deleteIssue);

module.exports = router;
