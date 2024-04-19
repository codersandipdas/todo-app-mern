const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.token || null;

  if (token == null) {
    res.clearCookie("token");
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.clearCookie("token");
      return res.status(403).json({
        status: false,
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticate;
