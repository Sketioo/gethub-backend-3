const models = require("../models");
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
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Mendapatkan semua produk pengguna
const getUserProducts = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const products = await models.Product.findAll({
      where: { user_id },
      include: {
        model: models.Category,
        attributes: ['name'],
      },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Produk tidak ditemukan",
        error_code: 404,
      });
    }

    const modifiedProducts = products.map(product => {
      const { Category, ...otherData } = product.toJSON();
      return {
        ...otherData,
        category: Category ? Category.name : null,
      };
    });

    return res.status(200).json({
      success: true,
      data: modifiedProducts,
      message: "Produk berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil produk:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Mendapatkan semua produk
const getAllProducts = async (req, res) => {
  try {
    const products = await models.Product.findAll({
      include: {
        model: models.Category,
        attributes: ['name'],
      },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Produk tidak ditemukan",
        error_code: 404,
      });
    }

    const processedProducts = products.map(product => {
      const { Category, ...otherData } = product.toJSON();
      return {
        ...otherData,
        category: Category ? Category.name : null,
      };
    });

    return res.status(200).json({
      success: true,
      data: processedProducts,
      message: "Produk berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil semua produk:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Mendapatkan produk berdasarkan ID
const getProductById = async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id, {
      include: {
        model: models.Category,
        attributes: ['name'],
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Produk tidak ditemukan",
        error_code: 404,
      });
    }

    const { Category, ...otherData } = product.toJSON();
    const modifiedProduct = {
      ...otherData,
      category: Category ? Category.name : null,
    };

    return res.status(200).json({
      success: true,
      data: modifiedProduct,
      message: "Produk berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil produk berdasarkan ID:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
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
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
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
      return res.status(204).send();
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
      message: "Kesalahan internal server",
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
