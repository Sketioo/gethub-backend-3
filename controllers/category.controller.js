// controllers/categoryController.js
const models = require("../models");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await models.Category.findAll();
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: categories,
      message: "Kategori berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil kategori",
      error_code: 500,
    });
  }
};

const getCategoryById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await models.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        error_code: 404,
      });
    }
    res.status(200).json({
      success: true,
      data: category,
      message: "Kategori berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await models.Category.create({ name });
    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Kategori berhasil dibuat",
      error_code: 0,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    let category = await models.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        error_code: 404,
      });
    }
    await models.Category.update(
      { name },
      { where: { id: id } }
    );
    category = await models.Category.findByPk(id);
    res.status(200).json({
      success: true,
      message: "Kategori berhasil diperbarui",
      error_code: 0,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await models.Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan',
        error_code: 404,
      });
    }
    await models.Category.destroy({ where: { id: id } });
    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus",
      error_code: 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
