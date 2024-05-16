const models = require("../models");
const bcryptjs = require("bcryptjs");
const { Sequelize } = require("sequelize");

const { getUserId } = require("../helpers/utility")

const {
  generateRandomString,
  generateAccessToken,
} = require("../helpers/utility");
const { createMail, transporter } = require("../helpers/email-verification")

// Function expressions
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
      is_verify: null,
      is_premium: false,
      theme_hub: false,
      is_complete_profile: false,
    };

    const user = await models.User.create(newUserData);

    // Send Email Verification
    const token = generateRandomString(20);
    const mail = createMail(req, token)

    const createToken = await models.EmailVerification.create({
      user_id: user.id,
      token,
      email: user.email
    })

    await transporter.sendMail(mail)

    const { password, id, ...customizedUser } = user.dataValues;
    console.log(user.dataValues)
    return res.status(201).json({
      data: customizedUser,
      message: "Pengguna berhasil dibuat, email verifikasi sudah terkirim",
      success: true,
      error_code: 0,
    });
  } catch (error) {
    console.log("Error di signup proses: ", error);
    return res.status(500).json({
      message: "Ada kesalahan!",
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
    console.log(user.dataValues)

    const { password, id, ...userWithoutPassword } = user.dataValues;
    userWithoutPassword.token = token;
    console.log(user.dataValues)

    return res.status(200).json({
      message: "Autentikasi berhasil!",
      data: userWithoutPassword,
      success: true,
      error_code: 0,
    });
  } catch (error) {
    console.log("Error pada proses login: ", error);
    return res.status(500).json({
      message: "Ada kesalahan!",
      success: false,
      error_code: 500,
    });
  }
};

// Get profile by ID
const getProfileById = async (req, res) => {
  try {
    const user_id = getUserId(req)
    const user = await models.User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    // Filter out sensitive data
    const {
      password,
      qr_code,
      is_verify,
      is_premium,
      theme_hub,
      role_id,
      is_complete_profile,
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
      message: "Ada kesalahan!",
      error_code: 500,
    });
  }
};

// Mendapatkan semua profil
const getAllProfiles = async (req, res) => {
  try {
    const users = await models.User.findAll();
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada profil yang ditemukan",
        error_code: 404,
      });
    }

    // Memfilter data sensitif untuk semua pengguna
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
      message: "Terjadi kesalahan!",
      error_code: 500,
    });
  }
};

// Perbarui profil
const updateProfile = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const { email, ...userData } = req.body;
    const updatedUser = await models.User.update(userData, {
      where: { id: user_id },
    });
    console.log(updatedUser)
    if (updatedUser[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profil pengguna berhasil diperbarui",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan!",
      error_code: 500,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const user_id = getUserId(req)
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
      message: "Terjadi kesalahan!",
      error_code: 500,
    });
  }
};

// Fungsi bantuan untuk memfilter produk
const filterProducts = (products) =>
  products.map((product) => ({
    name: product.name,
    price: product.price,
    description: product.description,
    image_url: product.image_url,
  }));

// Fungsi bantuan untuk memfilter tautan
const filterLinks = (links) =>
  links.map((link) => ({
    category: link.category,
    link: link.link,
  }));

const getPublicUser = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await models.User.findOne({
      where: { username: username },
      include: [
        { model: models.Link, as: "Links" },
        { model: models.Product, as: "Products" },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    const filteredProducts = filterProducts(user.Products);
    const filteredLinks = filterLinks(user.Links);

    const publicUserData = {
      id: user.id,
      username: user.username,
      profession: user.profession,
      name: user.full_name,
      phone: user.phone,
      email: user.email,
      web: user.web,
      about: user.about,
      products: filteredProducts,
      links: filteredLinks,
    };

    return res.status(200).json({
      success: true,
      data: publicUserData,
      message: "Data publik pengguna berhasil diambil",
    });
  } catch (error) {
    if (error instanceof SequelizeEagerLoadingError) {
      return res.status(400).json({
        success: false,
        message: "Error mengambil data publik pengguna",
        error_code: 400,
      });
    }

    console.error("Error mengambil data pengguna:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan!",
      error_code: 500,
    });
  }
};

module.exports = {
  register,
  login,
  getProfileById,
  getAllProfiles,
  updateProfile,
  deleteProfile,
  getPublicUser,
};
