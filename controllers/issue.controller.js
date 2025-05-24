const { issueClassifier } = require("../utils/ai");
const db = require("../database");
const { issueTable } = require("../database/schema");

const createIssue = async (req, res) => {
  const { description, city } = req.body;

  if (!req.file) {
    return res.status(400).json({
      data: null,
      message: "Internal error",
    });
  }
  console.log(req.file.filename);
  try {
    const classification = await issueClassifier(description);

    const issue = await db.insert(issueTable).values({
      city,
      description,
      classification,
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
