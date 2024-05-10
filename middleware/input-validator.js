const { userRegisterSchema, userLoginSchema } = require("../schemas");

//* User
exports.validateRegisterUser = (req, res, next) => {
  const { error } = userRegisterSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "full_name":
            return "Nama lengkap tidak boleh kosong.";
          case "user_name":
            return "Nama pengguna tidak boleh kosong.";
          case "email":
            return "Email tidak valid.";
          case "password":
            return "Password harus terdiri dari minimal 6 karakter.";
          case "phone":
            return "Nomor telepon harus terdiri dari 10 hingga 15 angka.";
          default:
            return el.message.replace(/"/g, "");
        }
      })
      .join(", ");

    return res.status(400).json({
      success: false,
      message: messages,
      error_code: 400,
    });
  } else {
    next();
  }
};

exports.validateLoginUser = (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    const msg = error.details
      .map((el) => {
        switch (el.context.key) {
          case "email":
            return "Email tidak valid.";
          case "password":
            return "Password harus terdiri dari minimal 6 karakter.";
          default:
            return el.message.replace(/"/g, "");
        }
      })
      .join(", ")

    return res.status(400).json({
      success: false,
      message: msg,
      error_code: 400,
    });
  } else {
    next();
  }
};

//* Product

exports.validateProduct = (req, res, next) => {
  const { error } = userRegisterSchema.validate(req.body);
  if (error) {
    const msg = error.details
      .map((el) => el.message.replace(/"/g, ""))
      .join(", ");
    return res.status(400).json({
      success: false,
      message: msg,
      error_code: 400,
    })
  }
}

//* Link
exports.validateLink = (req, res, next) => {
  const { error } = userRegisterSchema.validate(req.body);
  if (error) {
    const msg = error.details
      .map((el) => el.message.replace(/"/g, ""))
      .join(", ");
    return res.status(400).json({
      success: false,
      message: msg,
      error_code: 400,
    })
  } else {
    next();
  }
}