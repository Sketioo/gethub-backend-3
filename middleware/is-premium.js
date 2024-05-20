
const models = require("../models")

const {getUserId} = require("../helpers/utility")

exports.isPremium = (req, res, next) => {
  try {
    const user_id = getUserId(req)
    const user = models.User.findOne({where: {id: user_id}})
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
        error_code: 404
      })
    }
    if (!user.is_premium) {
      return res.status(403).json({
        success: false,
        message: "Anda bukan user premium",
        error_code: 403
      })
    }
    next()
  } catch (error) {
    console.error(`Terdapat error: ${error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500
    })
  }
}