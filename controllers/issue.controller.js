const { eq, or, like, desc, sql } = require("drizzle-orm");
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
  const { description, city, latitude, longitude } = req.body;

  if (!req.file) {
    return res.status(400).json({
      data: null,
      message: "Internal error",
    });
  }

  try {
    const classification = await issueClassifier(description, req.file);

    const { title, category, priority, conclusion } =
      JSON.parse(classification);

    if (!conclusion) {
      return res.status(400).json({
        data: null,
        message:
          "Image or text is not aligned to the description or any of the categories.",
      });
    }

    const radiusInMeters = 5;
    const earthRadius = 6371000; // Earth radius in meters

    const nearbyIssues = await db
      .select()
      .from(issueTable)
      .where(
        sql`
    ${earthRadius} * 2 * ASIN(
      SQRT(
        POWER(SIN(RADIANS((${latitude} - issueTable.latitude) / 2)), 2) +
        COS(RADIANS(${latitude})) * COS(RADIANS(issueTable.latitude)) *
        POWER(SIN(RADIANS((${longitude} - issueTable.longitude) / 2)), 2)
      )
    ) < ${radiusInMeters}
  `
      )
      .where(eq(issueTable.category, category))
      .where(eq(issueTable.city, city));

    if (nearbyIssues.length > 0) {
      return res.status(400).json({
        data: null,
        message: "This issue has already been reported.",
      });
    }

    const issue = await db.insert(issueTable).values({
      city,
      description,
      title,
      category,
      priority,
      imageUrl: "/uploads/" + req.file.filename,
      userId: req.user.id,
      latitude,
      longitude,
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

/**
 * Retrieves all issues from the database.
 *
 * @function getIssues
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 *
 * @returns {Promise<Express.Response>} The response object.
 *
 * @throws {Error} If there's an error while retrieving the issues.
 *
 * @example
 * const { getIssues } = require("../controllers/issue.controller");
 *
 * getIssues(req, res);
 */
const getIssues = async (req, res) => {
  try {
    const issues = await db.query.issueTable.findMany({
      orderBy: (issueTable, { desc }) => [desc(issueTable.createdAt)],
      with: {
        author: true,
      },
    });
    return res.json({
      data: issues,
      message: "Issues fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: "Internal error while fetching issues. Please try again.",
    });
  }
};

/**
 * Retrieves all issues created by the user from the database.
 *
 * @function getIssuesByUser
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 *
 * @returns {Promise<Express.Response>} The response object.
 *
 * @throws {Error} If there's an error while retrieving the issues.
 *
 * @example
 * const { getIssuesByUser } = require("../controllers/issue.controller");
 *
 * getIssuesByUser(req, res);
 */
const getIssuesByUser = async (req, res) => {
  try {
    const issues = await db.query.issueTable.findMany({
      where: eq(issueTable.userId, req.user.id),
      orderBy: (issueTable, { desc }) => [desc(issueTable.createdAt)],
      with: {
        author: true,
      },
    });
    return res.json({
      data: issues,
      message: "Issues fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: "Internal error while fetching issues. Please try again.",
    });
  }
};

/**
 * Retrieves an issue by its ID from the database.
 *
 * @function getIssueById
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 *
 * @returns {Promise<Express.Response>} The response object.
 *
 * @throws {Error} If there's an error while retrieving the issue.
 *
 * @example
 * const { getIssueById } = require("../controllers/issue.controller");
 *
 * getIssueById(req, res);
 */
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await db.query.issueTable.findFirst({
      where: eq(issueTable.id, parseInt(id)),
    });
    return res.json({
      data: issue,
      message: "Issue fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: "Internal error while fetching issue. Please try again.",
    });
  }
};

/**
 * Updates an issue by its ID in the database.
 *
 * @function updateIssue
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 *
 * @returns {Promise<Express.Response>} The response object.
 *
 * @throws {Error} If there's an error while updating the issue.
 *
 * @example
 * const { updateIssue } = require("../controllers/issue.controller");
 *
 * updateIssue(req, res);
 */
const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.description) {
      const classification = await issueClassifier(req.body.description);
      const { category, priority } = JSON.parse(classification);
      req.body.classification = category;
      req.body.priority = priority;
    }
    const issue = await db
      .update(issueTable)
      .set({
        ...req.body,
      })
      .where(eq(issueTable.id, parseInt(id)));

    return res.json({
      data: issue,
      message: "Issue updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: "Internal error while updating issue. Please try again.",
    });
  }
};

/**
 * Searches for issues in the database.
 *
 * @function searchIssues
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 *
 * @returns {Promise<Express.Response>} The response object.
 *
 * @throws {Error} If there's an error while searching for the issues.
 *
 * @example
 * const { searchIssues } = require("../controllers/issue.controller");
 *
 * searchIssues(req, res);
 */
const searchIssues = async (req, res) => {
  try {
    const { search } = req.query;

    let whereClause = undefined;
    if (search && search != "") {
      whereClause = or(
        like(issueTable.title, `%${search}%`),
        like(issueTable.description, `%${search}%`),
        like(issueTable.category, `%${search}%`),
        like(issueTable.priority, `%${search}%`)
      );
    }
    const issues = await db.query.issueTable.findMany({
      where: whereClause,
      orderBy: (issueTable, { desc }) => [desc(issueTable.createdAt)],
      with: {
        author: true,
      },
    });

    return res.json({
      data: issues,
      message: "Issues fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: "Internal error while fetching issues. Please try again.",
    });
  }
};

/**
 * Deletes an issue by its ID from the database.
 *
 * @function deleteIssue
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 *
 * @returns {Promise<Express.Response>} The response object.
 *
 * @throws {Error} If there's an error while deleting the issue.
 *
 * @example
 * const { deleteIssue } = require("../controllers/issue.controller");
 *
 * deleteIssue(req, res);
 */
const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await db
      .delete(issueTable)
      .where(eq(issueTable.id, parseInt(id)));
    return res.json({
      data: issue,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: "Internal error while deleting issue. Please try again.",
    });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  getIssuesByUser,
  updateIssue,
  deleteIssue,
  searchIssues,
};
