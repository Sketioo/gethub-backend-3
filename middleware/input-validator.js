const {
  userRegisterSchema, userLoginSchema,
  productSchema, linkSchema, sponsorSchema,
  informationSchema, partnerSchema,
  userUpdateSchema, certificationSchema,
  projectSchema, categorySchema, projectReviewFreelanceSchema,
  projectTaskSchema, projectReviewSchema, projectUserBidSchema
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

    return res.status(400).json({
      success: false,
      message: messages,
      error_code: 400,
    })
  } else {
    next();
  }
};

exports.validateUpdateUser = (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "full_name":
            return "Nama lengkap tidak boleh kosong.";
          case "profession":
            return "Profesi tidak boleh kosong.";
          case "phone":
            return "Nomor telepon harus terdiri dari 10 hingga 15 angka.";
          case "email":
            return "Email tidak valid.";
          case "address":
            return "Alamat lengkap tidak boleh kosong.";
          case "theme_hub":
            return "Theme_hub tidak boleh kosong."
          default:
            return el.message.replace(/"/g, "");
        }
      })
      .join(", ");

    return res.status(400).json({
      success: false,
      message: messages,
      error_code: 400,
    })
  } else {
    next()
  }
}
//* Product

exports.validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case 'name':
            return 'Nama produk tidak boleh kosong.';
          case 'description':
            return 'Deskripsi tidak boleh kosong.';
          case 'category_id':
            return 'Id kategori tidak boleh kosong.';
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
          case 'category':
            return "Category tidak boleh kosong";
          case 'is_active':
            return "Is_active tidak boleh kosong";
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

//* Certification

exports.validateCertification = (req, res, next) => {
  const { error } = certificationSchema.validate(req.body);

  if (error) {
    const messages = error.details.map((el) => {
      switch (el.context.key) {
        case "title":
          return "Title harus diisi.";
        case "category_id":
          return "Category harus diisi.";
        case "image":
          return "Image harus diisi.";
        default:
          return el.message.replace(/"/g, '');
      }
    }).join(', ')

    return res.status(400).json({
      success: false,
      message: messages,
      error_code: 400
    })
  }
}

//* Category

exports.validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "name":
            return "Nama kategori harus diisi.";
          default:
            return el.message.replace(/"/g, '');
        }
      }).join(', ');
    return res.status(400).json({
      success: false,
      message: messages,
      error_code: 400
    })
  }
}



//* Project

exports.validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "owner_id":
            return "ID Pemilik diperlukan dan harus berupa UUID yang valid.";
          case "title":
            return "Judul diperlukan.";
          case "category_id":
            return "ID Kategori diperlukan dan harus berupa UUID yang valid.";
          case "min_budget":
          case "max_budget":
            return "Anggaran harus berupa angka.";
          case "min_deadline":
          case "max_deadline":
            return "Batas waktu harus berupa tanggal yang valid dalam format ISO.";
          case "chatroom_id":
            return "ID Ruang Obrolan diperlukan dan harus berupa UUID yang valid.";
          case "status_project":
            return "Status proyek harus salah satu dari: BUKA, PENAWARAN, TUTUP, SELESAI.";
          case "status_freelance_task":
            return "Status tugas freelancer harus salah satu dari: BUKA, TUTUP.";
          case "status_payment":
            return "Status pembayaran harus salah satu dari: MENUNGGU, PENYELESAIAN.";
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

//* Project User Bid
exports.validateProjectUserBid = (req, res, next) => {
  const { error } = projectUserBidSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "project_id":
            return "ID Proyek diperlukan dan harus berupa UUID yang valid.";
          case "user_id":
            return "ID Pengguna diperlukan dan harus berupa UUID yang valid.";
          case "budget_bid":
            return "Penawaran anggaran diperlukan dan harus berupa angka.";
          case "is_selected":
            return "Status seleksi harus berupa boolean.";
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


//* Project Task

exports.validateProjectTask = (req, res, next) => {
  const { error } = projectTaskSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "project_id":
            return "ID Proyek diperlukan dan harus berupa UUID yang valid.";
          case "task_number":
            return "Nomor tugas diperlukan dan harus berupa bilangan bulat.";
          case "task_description":
            return "Deskripsi tugas diperlukan.";
          case "task_status":
            return "Status tugas harus salah satu dari: DALAM PROSES, ULANGI, SELESAI.";
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

//* Project Review


exports.validateProjectReview = (req, res, next) => {
  const { error } = projectReviewSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "project_id":
            return "ID Proyek diperlukan dan harus berupa UUID yang valid.";
          case "owner_id":
            return "ID Pemilik diperlukan dan harus berupa UUID yang valid.";
          case "freelance_id":
            return "ID Freelancer diperlukan dan harus berupa UUID yang valid.";
          case "message":
            return "Pesan diperlukan.";
          case "sentiment":
            return "Sentimen diperlukan.";
          case "sentiment_score":
            return "Skor sentimen diperlukan dan harus berupa angka.";
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

//* Project Review Freelance

exports.validateProjectReviewFreelance = (req, res, next) => {
  const { error } = projectReviewFreelanceSchema.validate(req.body);
  if (error) {
    const messages = error.details
      .map((el) => {
        switch (el.context.key) {
          case "project_id":
            return "ID Proyek diperlukan dan harus berupa UUID yang valid.";
          case "owner_id":
            return "ID Pemilik diperlukan dan harus berupa UUID yang valid.";
          case "freelance_id":
            return "ID Freelancer diperlukan dan harus berupa UUID yang valid.";
          case "message":
            return "Pesan diperlukan.";
          case "sentiment":
            return "Sentimen diperlukan.";
          case "sentiment_score":
            return "Skor sentimen diperlukan dan harus berupa angka.";
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
