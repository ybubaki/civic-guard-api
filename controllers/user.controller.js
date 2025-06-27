const db = require("../database");
const { userTable } = require("../database/schema");
const { eq } = require("drizzle-orm");

const getAllUsers = async (req, res) => {
  try {
    const users = await db.query.userTable.findMany({
      select: {
        password: false,
      },
      with: {
        reports: true,
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db
      .update(userTable)
      .set({
        ...req.body,
      })
      .where(eq(userTable.id, parseInt(id)));
    return res.json({
      data: user,
      message: "User updated successfully",
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
  updateUser,
};
