const {
  userRegisterSchema, userLoginSchema,
  productSchema, linkSchema
} = require("../schemas");

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
  const { error } = productSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case 'name':
            return 'Nama produk tidak boleh kosong.';
          case 'price':
            return 'Harga tidak boleh kosong.';
          case 'description':
            return 'Deskripsi tidak boleh kosong.';
          case 'image_url':
            return 'URL gambar tidak valid.';
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


//* Link
exports.validateLink = (req, res, next) => {
  const { error } = linkSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case 'category':
            return 'Kategori tidak boleh kosong.';
          case 'link':
            return 'Link tidak valid.';
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


//* History Upload

exports.validateHistoryUpload = (req, res, next) => {
  const { error } = historyUploadSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case 'link':
            return 'Link tidak valid.';
          case 'extension':
            return 'Ekstensi harus berupa string.';
          case 'date':
            return 'Tanggal harus berupa tanggal.';
          default:
            return el.message.replace(/"/g, '');
        }
      })
      .join(', ');

    return res.status(400).json({
      success: false,
      message: messages,
      error_code: 400,
    });
  } else {
    next();
  }
};
