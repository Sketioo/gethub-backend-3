const nodemailer = require("nodemailer");

const models = require("../models")
const { generateRandomString, getUserId } = require("./utility")

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.MAIL_SERVICE,
  port: 465,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD
  }
});


const createVerificationToken = async (userId) => {
  const token = generateRandomString(20);

  const user = await models.User.findOne({
    where: { id: userId }
  })

  return token;
};

const createMail = (email, token) => {
  return {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Email Verification - GetHub',
    html: `
      <div style="text-align: center; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <img src="https://storage.googleapis.com/gethub_bucket/1715858818621logo.png" alt="GitHub Logo" style="max-width: 280px; margin-bottom: 5px;">
        <h2 style="color: #333;">Selamat Datang di GetHub!</h2>
        <p style="color: #666;">Untuk memulai, kami memerlukan verifikasi email Anda.</p>
        <a href="${process.env.WEB_HOST}/api/verify/${token}" style="display: inline-block; padding: 10px 20px; background-color: #0c758a; color: white; text-decoration: none; border-radius: 5px; margin-bottom: 20px;">Verifikasi Email</a>
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
        emailVerifSent: false,
        data: {
          image_url: "https://storage.googleapis.com/gethub_bucket/1715860038942failed.png"
        },
        message: "Token invalid",
        error_code: 400
      });
    }

    if (new Date() > verification.expiresAt) {
      await models.EmailVerification.destroy({ where: { token: token } });
      return res.render('email-verification', {
        success: false,
        emailVerifSent: false,
        data: {
          image_url: "https://storage.googleapis.com/gethub_bucket/1715860038942failed.png"
        },
        message: "Token kadaluarsa",
        error_code: 400
      });
    }

    await models.User.update({ is_verify: true }, { where: { id: verification.user_id } });
    await models.EmailVerification.destroy({ where: { token: token } });

    return res.render('email-verification', {
      success: true,
      emailVerifSent: false,
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

const regenerateVerificationToken = async (req, res) => {
  try {
    const {user_id} = getUserId(req);

    const user = await models.User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).render('email-verification', {
        emailVerifSent: false,
        success: false,
        message: "Token user tidak ditemukan",
        error_code: 404
      });
    }

    console.log(`User ID: ${user_id}`);

    await models.EmailVerification.destroy({ where: { user_id: user_id } });

    const token = await createVerificationToken(user_id);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await models.EmailVerification.create({
      token,
      user_id: user.id,
      expiresAt,
      email: user.email
    });

    const mailOptions = createMail(user.email, token);
    await transporter.sendMail(mailOptions);

    return res.status(200).render('email-verification', {
      success: true,
      emailVerifSent: true,
      message: "Email Verifikasi Terkirim",
      error_code: 0
    });
  } catch (error) {
    console.error('Error regenerating verification token:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500
    });
  }
};

module.exports = {
  transporter,
  createMail,
  verifyTokenEmail,
  createVerificationToken,
  regenerateVerificationToken
}