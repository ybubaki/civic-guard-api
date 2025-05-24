const { issueClassifier } = require("../utils/ai");
const db = require("../database");
const { issueTable } = require("../database/schema");

/**
 * Creates a new issue in the database.
 *
 * @function createIssue
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 *
 * @returns {Promise<Express.Response>} The response object.
 *
 * @throws {Error} If there's an error while creating the issue.
 *
 * @example
 * const { createIssue } = require("../controllers/issue.controller");
 *
 * createIssue(req, res);
 */
const createIssue = async (req, res) => {
  const { description, city } = req.body;

  if (!req.file) {
    return res.status(400).json({
      data: null,
      message: "Internal error",
    });
  }

  try {
    const classification = await issueClassifier(description);

    const { category, priority } = JSON.parse(classification);

    const issue = await db.insert(issueTable).values({
      city,
      description,
      classification: category,
      priority,
      imageUrl: "/uploads/" + req.file.filename,
    });

    return res.json({
      data: issue,
      message: "Issue created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: "Internal error while creating issue. Please try again.",
    });
  }
};

module.exports = {
  createIssue,
};
