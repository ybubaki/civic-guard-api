const db = require("../database");
const { eq } = require("drizzle-orm");
const { userTable } = require("../database/schema");
const argon2 = require("argon2");
const { generateToken } = require("../utils/helper");

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const hashedPassword = await argon2.hash(password);

    const user = await db.insert(userTable).values({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return res.json({
      data: user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      data: null,
      message: "Internal error while registering user. Please try again.",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, username, email } = req.body;

    const user = await db
      .update(userTable)
      .set({
        name,
        username,
        email,
      })
      .where(eq(userTable.id, parseInt(req.user.id)))
      .returning({
        id: userTable.id,
        name: userTable.name,
        username: userTable.username,
        role: userTable.role,
        email: userTable.email,
      });

    return res.json({
      data: user[0],
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      data: null,
      message: "Internal error while updating user. Please try again.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) {
      return res.status(404).json({
        data: null,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({
        data: null,
        message: "Invalid credentials",
      });
    }

    delete user.password;
    const token = generateToken(user);
    return res.json({
      data: {
        access_token: token,
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
          id: user.id,
          name: user.name,
        },
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      data: null,
      message: "Internal error while logging in user. Please try again.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, parseInt(req.user.id)),
    });

    if (!user) {
      return res.status(404).json({
        data: null,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await argon2.verify(user.password, currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        data: null,
        message: "Invalid credentials",
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    const updatedUser = await db
      .update(userTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(userTable.id, parseInt(req.user.id)));

    return res.json({
      data: updatedUser,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      data: null,
      message: "Internal error while changing password. Please try again.",
    });
  }
};

module.exports = {
  registerUser,
  updateUser,
  loginUser,
  changePassword,
};
