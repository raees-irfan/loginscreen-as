const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });

  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: "Server configuration error: JWT_SECRET not set",
    });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Invalid token format. Use: Bearer YOUR_TOKEN",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // {id, role}
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please login again to get a new token.",
      });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};


exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can perform this action" });
  }
  next();
};
