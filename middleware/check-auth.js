const { verifyAccessToken, getUserId } = require("../helpers/utility");
const models = require('../models')

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

const verifyUserMiddleware = async (req, res, next) => {
  try {
    const user_id = getUserId(req);
    const user = await models.User.findByPk(user_id);
    
    if (!user || !user.is_verify || !user.is_complete_profile) {
      return res.status(403).json({
        success: false,
        message: "User is not verified or does not have a complete profile",
        error_code: 403,
      });
    }
    
    next();
  } catch (error) {
    console.error("Error verifying user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify user",
      error_code: 500,
    });
  }
};

module.exports = {
  authenticateToken,
  isLoggedIn,
  verifyUserMiddleware
};
