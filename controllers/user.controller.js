const db = require("../database");
const { userTable } = require("../database/schema");

const getAllUsers = async (req, res) => {
  try {
    const users = await db.query.userTable.findMany({
      select: {
        password: false,
      },
    });
    return res.json({
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllUsers,
};
