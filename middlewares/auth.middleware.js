const { verifyToken } = require("../utils/helper");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      data: null,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      data: null,
      message: "Unauthorized",
    });
  }
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({
      data: null,
      message: "Unauthorized",
    });
  }
  req.user = user;
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      data: null,
      message: "Unauthorized",
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
