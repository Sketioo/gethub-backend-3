const {
  userRegisterSchema, userLoginSchema,
  productSchema, linkSchema, sponsorSchema,
  informationSchema, partnerSchema
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
          case "username":
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
    const messages = error.details
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
      .join(", ");
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

//* Sponsor

exports.validateSponsor = (req, res, next) => {
  const { error } = sponsorSchema.validate(req.body);

  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case 'name':
            return 'Nama sponsor tidak boleh kosong.';
          case 'image_url':
            return 'URL gambar tidak valid.';
          case 'link':
            return 'Link sponsor tidak valid.';
          default:
            return el.message.replace(/"/g, '');
        }
      })
      .join(', ');

    return res.status(420).json({
      success: false,
      message: messages,
      error_code: 420,
    })
  } else {
    next();
  }
}

//* Information

exports.validateInformation = (req, res, next) => {
  const { error } = informationSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case 'title':
            return 'Judul informasi tidak boleh kosong.';
          case 'description':
            return 'Deskripsi informasi tidak boleh kosong.';
          case 'image_url':
            return 'URL gambar tidak valid.';
          default:
            return el.message.replace(/"/g, '');
        }
      })
      .join(', ');

    return res.status(400).json({
      success: false,
      message: messages,
      error_code: 400
    })
  } else {
    next();
  }
}

//* Partner

exports.validatePartner = (req, res, next) => {
  const { error } = partnerSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "email":
            return "Email tidak valid.";
          case "password":
            return "Password harus terdiri dari minimal 6 karakter.";
          case "full_name":
            return "Nama lengkap harus diisi.";
          case "profession":
            return "Profesi harus diisi.";
          case "phone":
            return "Nomor telepon harus diisi.";
          case "photo":
            return "Foto harus diisi.";
          case "address":
            return "Alamat harus diisi.";
          case "website":
            return "Website tidak valid.";
          case "image":
            return "Image tidak valid.";
          default:
            return el.message.replace(/"/g, '');
        }
      })
      .join(', ');
      return res.status(400).json({
        success: false,
        message: messages,
        error_code: 400
      })
  } else {
    next();
  }
}