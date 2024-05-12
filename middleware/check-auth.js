const { verifyAccessToken } = require("../helpers/utility");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error_code: 401,
      message: "Kredential tidak sah!",
    });
  }

  const result = await verifyAccessToken(token);

  if (!result.success) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Kredential tidak sah!",
        error_code: 401,
      });
  }

  req.data = result.token;
  next();
};

const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    return next();
  } else {
    return res.status(401).json({ message: "Kredensial tidak sah!" });
  }
};

module.exports = {
  authenticateToken,
  isLoggedIn,
};
