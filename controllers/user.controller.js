const models = require("../models");
const bcryptjs = require("bcryptjs");

const { Sequelize } = require("sequelize");

const { getUserId, getThemehub, getUserProfileCard } = require("../helpers/utility");


const {
  generateRandomString,
  generateAccessToken,
} = require("../helpers/utility");
const { createMail, transporter, createVerificationToken } = require("../helpers/email-verification")


const register = async (req, res) => {
  try {
    const existingUser = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Email sudah terdaftar!",
        success: false,
        error_code: 409,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const username = req.body.full_name
      .toString()
      .replace(/\s+/g, "")
      .toLowerCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const newUserData = {
      full_name: req.body.full_name,
      username: `${username}${randomNumber}`,
      email: req.body.email,
      password: hash,
      profession: req.body.profession,
      phone: req.body.phone,
      web: req.body.web,
      address: req.body.address,
      photo: req.body.photo,
      about: req.body.about,
      qr_code: generateRandomString(12),
      is_verify: false,
      is_premium: false,
      is_verif_ktp: false,
      is_verif_ktp_url: null,
      theme_hub: getThemehub(),
      is_complete_profile: false,
    };

    const user = await models.User.create(newUserData);

    // Send Email Verification
    const token = await createVerificationToken(user.id)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await models.EmailVerification.create({
      token,
      user_id: user.id,
      expiresAt,
      email: user.email
    });

    const mail = createMail(req.body.email, token)

    await transporter.sendMail(mail)

    const { password, id, ...customizedUser } = user.dataValues;
    return res.status(201).json({
      data: customizedUser,
      message: "Pengguna berhasil dibuat, email verifikasi sudah terkirim",
      success: true,
      error_code: 0,
    });
  } catch (error) {
    console.log("Error di signup proses: ", error);
    return res.status(500).json({
      message: "Kesalahan internal server",
      success: false,
      error_code: 500,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(401).json({
        message: "Kredensial tidak valid!",
        success: false,
        error_code: 401,
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Kredensial tidak valid!",
        success: false,
        error_code: 401,
      });
    }

    const token = generateAccessToken(user);

    const { password, id, ...userWithoutPassword } = user.dataValues;
    userWithoutPassword.token = token;

    return res.status(200).json({
      message: "Autentikasi berhasil!",
      data: userWithoutPassword,
      success: true,
      error_code: 0,
    });
  } catch (error) {
    console.log("Error pada proses login: ", error);
    return res.status(500).json({
      message: "Kesalahan internal server",
      success: false,
      error_code: 500,
    });
  }
};

const getProfileById = async (req, res) => {
  try {
    const {user_id} = getUserId(req)
    const user = await models.User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    // Filter out sensitive data
    const {
      password,
      ...customizedUser
    } = user.dataValues;

    return res.status(200).json({
      success: true,
      data: customizedUser,
      message: "Pengguna ditemukan",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil data:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getAllUsersAdmin = async (req, res) => {
  try {
    const { is_verif_ktp } = req.query;
    
    let filter = {};
    if (is_verif_ktp !== undefined) {
      filter = { is_verif_ktp: is_verif_ktp === 'true' };
    }

    const users = await models.User.findAll({ where: filter });
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `Tidak ada profil yang ${is_verif_ktp === 'true' ? 'terverifikasi' : 'belum diverifikasi'} KTP`,
        error_code: 404,
      });
    }

    const customizedUsers = users.map((user) => {
      const {
        password,
        username,
        qr_code,
        is_verify,
        is_premium,
        theme_hub,
        // role_id,
        is_complete_profile,
        ...customizedUser
      } = user.dataValues;
      return customizedUser;
    });

    return res.status(200).json({
      success: true,
      data: customizedUsers,
      message: `Semua profil ${is_verif_ktp === 'true' ? 'terverifikasi' : 'belum diverifikasi'} KTP berhasil diambil`,
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil data semua profil:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  } 
};

const updateUserVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verif_ktp } = req.body;

    const user = await models.User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404
      });
    }

    await user.update({ is_verif_ktp: is_verif_ktp });

    return res.status(200).json({
      success: true,
      message: `Status verifikasi KTP pengguna berhasil diperbarui menjadi ${is_verif_ktp}`,
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat memperbarui status verifikasi KTP pengguna:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
};


const getAllProfiles = async (req, res) => {
  try {
    const users = await models.User.findAll();
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Tidak ada profil yang ditemukan",
        error_code: 404,
      });
    }

    const customizedUsers = users.map((user) => {
      const {
        password,
        username,
        qr_code,
        is_verify,
        is_premium,
        theme_hub,
        // role_id,
        is_complete_profile,
        ...customizedUser
      } = user.dataValues;
      return customizedUser;
    });

    return res.status(200).json({
      success: true,
      data: customizedUsers,
      message: "Semua profil berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil data semua profil:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Perbarui profil
const updateProfile = async (req, res) => {
  try {
    const {user_id} = getUserId(req);
    const { email, ...userData } = req.body;

    userData.is_complete_profile = true;

    // Update user data in the database
    const [updatedRows] = await models.User.update(userData, {
      where: { id: user_id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil pengguna berhasil diperbarui",
      error_code: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};


const deleteProfile = async (req, res) => {
  try {
    const {user_id} = getUserId(req)
    const deletedUser = await models.User.destroy({
      where: { id: user_id },
    });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil pengguna berhasil dihapus",
      error_code: 0,
    });
  } catch (error) {
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({
        success: false,
        message:
          "Tidak dapat menghapus pengguna karena adanya konstrain kunci asing yang ada",
        error_code: 400,
      });
    }

    console.error("Error menghapus profil:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getPublicUser = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await models.User.findOne({
      where: { username: username },
      include: [
        { model: models.Link, as: "links" },
        { model: models.Product, as: "products" },
        { model: models.Certification, as: "certifications",include: [
          {
            model: models.Category,
            as: 'Category',
            attributes: ['name']
          },
        ],}
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    const userData = user.toJSON();
    userData.certifications = userData.certifications.map(certification => {
      certification.category_name = certification.Category.name;
      delete certification.Category;
      return certification;
    });
    
    const backgroundCard = await getUserProfileCard(username);

    const dummyProject = [
      {
        "title": "UI UX Designer",
        "sentiment": "POSITIVE"
      }
    ];

    return res.status(200).json({
      success: true,
      data: {
        ...userData,
        background_card : backgroundCard,
        projects : dummyProject
      },
      message: "Data publik pengguna berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil data pengguna:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};


const getAllRoles = async (req, res) => {
  try {
    const roles = await models.Role.findAll();
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Tidak ada role yang ditemukan",
        error_code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      data: roles,
      message: "Semua role berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil data:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};


const createRole = async (req, res) => {
  try {
    const role = await models.Role.create(req.body);
    if(!role) {
      return res.status(400).json({
        success: false,
        message: "Gagal membuat role",
        error_code: 400,
      })
    }
    return res.status(201).json({
      success: true,
      message: "Role berhasil dibuat",
      error_code: 0,
    })
  } catch (error) {
    console.error("Error membuat role:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    })
  }
}

const updateVisibility = async (req, res) => {
  try{
    const {user_id} = getUserId(req);
    const { is_visibility } = req.body;

    if (typeof is_visibility !== 'boolean') {
      return res.status(400).json({ error: 'is_visibility harus berupa boolean' });
    }

    const [updatedRows] = await models.User.update(
      { is_visibility },
      { where: { id: user_id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Visibilitas berhasil diperbarui",
      error_code: 0,
    });
    

  } catch (error) {
    console.error("Error mengubah visibility:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    })
  }
}

const updateThemeHub = async (req, res) => {
  try{
    const {user_id} = getUserId(req);
    const { theme_hub } = req.body;

    const user = await models.User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    if (user.is_premium === false && (theme_hub > 6 && theme_hub <= 12)) {
      return res.status(403).json({
        success: false,
        message: "Pengguna tidak dapat memilih theme_hub 6-12 karena bukan premium",
        error_code: 403,
      });
    }

    if (user.is_premium === true || (theme_hub >= 1 && theme_hub <= 12)) {
      const [updatedRows] = await models.User.update(
        { theme_hub },
        { where: { id: user_id } }
      );

    if (typeof theme_hub !== 'number') {
      return res.status(400).json({ 
        success: false,
        error: 'theme_hub harus berupa number',
        error_code: 400});
    }


    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Theme hub berhasil diperbarui",
      error_code: 0,
    });
  }
    return res.status(400).json({
      success: false,
      message: "Theme_hub tidak valid",
      error_code: 400,
    });

  } catch (error) {
    console.error("Error mengubah theme hub:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    })
  }
}

const getTopTalent = async (req, res) => {
  try{
    const topTalent = await models.User.findAll({
      where: { is_premium: true },
      limit : 5,
    })

    if (!topTalent || topTalent.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Tidak ada top talent yang ditemukan",
        error_code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      data: topTalent,
      message: "Top talent berhasil diambil",
      error_code: 0,
    });
  
  }catch(error){
    console.error("Error mengambil top talent:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    })
  }
}

module.exports = {
  register,
  login,
  getProfileById,
  getAllProfiles,
  updateProfile,
  deleteProfile,
  getPublicUser,
  getAllRoles,
  createRole,
  getAllUsersAdmin,
  updateUserVerificationStatus,
  updateVisibility,
  updateThemeHub,
  getTopTalent
};
