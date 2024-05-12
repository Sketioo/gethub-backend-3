const nodemailer = require("nodemailer");

const models = require("../models")

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.MAIL_SERVICE,
  port: 465,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD
  }
});

const createMail = (req, token) => {
  return {
    from: process.env.AUTH_EMAIL,
    to: req.body.email,
    subject: 'Email Verification',
    // text: `Click the following link to verify your email: ${process.env.WEB_HOST}/${token}`
    text: `Click the following link to verify your email: http://localhost:3000/api/verify/${token}`
  }
}

const verifyTokenEmail = async (req, res, next) => {
  try{
    const token = req.params.token;

    const verification = await models.EmailVerification.findOne({ where: { token: token } });
    if(!verification) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
        error_code: 400
      })
    }

    console.dir(verification)
    const user = await models.User.update({ is_verify: true }, { where: { id: verification.user_id } });
    console.log(user)
    await models.EmailVerification.destroy({ where: { token: token } });

    return res.status(200).json({
      success: true,
      message: "Email terverifikasi",
      error_code: 0
    })

  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error_code: 500
    })
  }
}

module.exports = {
  transporter,
  createMail,
  verifyTokenEmail
}