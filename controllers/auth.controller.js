const db = require("../database");
const { eq, and, gt } = require("drizzle-orm");
const { userTable, otpTable } = require("../database/schema");
const argon2 = require("argon2");
const { generateToken } = require("../utils/helper");
const { sendEmail } = require("../utils/email");

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, phone } = req.body;

    const hashedPassword = await argon2.hash(password);

    const user = await db.insert(userTable).values({
      name,
      username,
      email,
      phone,
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
    const { name, username, email, phone } = req.body;

    const user = await db
      .update(userTable)
      .set({
        name,
        username,
        email,
        phone,
      })
      .where(eq(userTable.id, parseInt(req.user.id)))
      .returning({
        id: userTable.id,
        name: userTable.name,
        username: userTable.username,
        role: userTable.role,
        rating: userTable.rating,
        email: userTable.email,
        phone: userTable.phone,
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
          phone: user.phone,
          rating: user.rating,
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

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) {
      return res.status(404).json({
        data: null,
        message: "User not found",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    await db.insert(otpTable).values({
      otp: parseInt(otp).toString(),
      userId: user.id,
    });

    await sendEmail(email, "Otp Verification", "Your otp is " + otp);

    return res.json({
      data: null,
      message: "Otp sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      data: null,
      message: "Internal error while sending otp. Please try again.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // First, find the user by email
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) {
      return res.status(404).json({
        data: null,
        message: "User not found",
      });
    }

    // Then find the OTP for this user
    const otpData = await db.query.otpTable.findFirst({
      where: eq(otpTable.otp, otp),
    });

    console.log(otpData);

    if (!otpData) {
      return res.status(400).json({
        data: null,
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await argon2.hash(newPassword);

    // Update user's password
    await db
      .update(userTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(userTable.id, user.id));

    // Delete the used OTP
    await db.delete(otpTable).where(eq(otpTable.userId, user.id));

    return res.json({
      data: null,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({
      data: null,
      message: "Internal server error while changing password",
    });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const user = await db
      .update(userTable)
      .set({
        role: "admin",
      })
      .where(eq(userTable.id, parseInt(req.user.id)));

    return res.json({
      data: user,
      message: "User made admin successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      data: null,
      message: "Internal error while making user admin. Please try again.",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await db.query.userTable.findFirst({
      where: eq(userTable.id, req.user.id),
    });
    delete user.password;
    return res.json({
      data: user,
      message: "User fetched successfully",
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
  registerUser,
  updateUser,
  loginUser,
  changePassword,
  sendOtp,
  forgotPassword,
  makeAdmin,
  getMe,
};
