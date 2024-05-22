const models = require("../models");
const jwt = require("jsonwebtoken");
const { getUserId } = require("../helpers/utility");

// Membuat produk baru
const createProduct = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const checkUser = await models.User.findByPk(user_id);
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
        error_code: 404,
      });
    }
    const product = await models.Product.create({ ...req.body, user_id });
    return res.status(201).json({
      success: true,
      data: product,
      message: "Produk berhasil dibuat",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error membuat produk:", error);
    return res.status(400).json({
      success: false,
      message: "Gagal membuat produk",
      error_code: 400,
    });
  }
};

// Mendapatkan semua produk pengguna
const getUserProducts = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const products = await models.Product.findAll({
      where: {
        user_id,
      },
    });
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: products,
      message: "Produk berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil produk:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
      error_code: 500,
    });
  }
};

// Mendapatkan semua produk
const getAllProducts = async (req, res) => {
  try {
    const products = await models.Product.findAll();
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: products,
      message: "Produk berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil semua produk:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil semua produk",
      error_code: 500,
    });
  }
};

// Mendapatkan produk berdasarkan ID
const getProductById = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
      message: "Produk berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil produk berdasarkan ID:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
      error_code: 500,
    });
  }
};

// Memperbarui produk berdasarkan ID
const updateProduct = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
        error_code: 404,
      });
    }
    if (user_id === product.user_id) {
      await product.update(req.body);
      return res.status(200).json({
        success: true,
        message: "Produk berhasil diperbarui",
        error_code: 0,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Anda tidak diizinkan memperbarui produk ini",
        error_code: 403,
      });
    }
  } catch (error) {
    console.error("Error memperbarui produk:", error);
    return res.status(400).json({
      success: false,
      message: "Gagal memperbarui produk",
      error_code: 400,
    });
  }
};

// Menghapus produk berdasarkan ID
const deleteProduct = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
        error_code: 404,
      });
    }
    if (user_id === product.user_id) {
      await product.destroy();
      return res.status(200).json({
        success: true,
        message: "Produk berhasil dihapus",
        error_code: 0,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Anda tidak diizinkan menghapus produk ini",
        error_code: 403,
      });
    }
  } catch (error) {
    console.error("Error menghapus produk:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus produk",
      error_code: 500,
    });
  }
};

module.exports = {
  createProduct,
  getUserProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
