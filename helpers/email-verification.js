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
    subject: 'Email Verification - GetHub',
    html: `
      <div style="text-align: center; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <img src="https://storage.googleapis.com/gethub_bucket/1715858818621logo.png" alt="GitHub Logo" style="max-width: 280px; margin-bottom: 5px;">
        <h2 style="color: #333;">Selamat Datang di GetHub!</h2>
        <p style="color: #666;">Untuk memulai, kami memerlukan verifikasi email Anda.</p>
        <a href="${process.env.WEB_HOST}/api/verify/${token}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Verifikasi Email</a>
        <p style="color: #666;">Jika tidak bisa mengklik tombol di atas, Anda juga bisa salin dan tempel URL berikut ke dalam browser Anda:</p>
        <a style="color: #666; margin-bottom: 20px;">${process.env.WEB_HOST}/api/verify/${token}</a>
        <p style="color: #666;">Terima kasih telah bergabung dengan GetHub!</p>
        <p style="color: #666; font-style: italic;">Tim GetHub</p>
      </div>
    `
  };
};



const verifyTokenEmail = async (req, res, next) => {
  try {
    const token = req.params.token;

    const verification = await models.EmailVerification.findOne({ where: { token: token } });
    if (!verification) {
      return res.render('email-verification', {
        success: false,
        data: {
          image_url: "https://storage.googleapis.com/gethub_bucket/1715860038942failed.png"
        },
        message: "Invalid token",
        error_code: 400
      });
    }

    await models.User.update({ is_verify: true }, { where: { id: verification.user_id } });
    await models.EmailVerification.destroy({ where: { token: token } });

    return res.render('email-verification', {
      success: true,
      data: {
        image_url: "https://storage.googleapis.com/gethub_bucket/1715860026185success.png"
      },
      message: "Email terverifikasi",
      error_code: 0
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error_code: 500
    });
  }
}


module.exports = {
  transporter,
  createMail,
  verifyTokenEmail
}