const models = require("../models");

const getAllInformation = async (req, res, next) => {
  try {
    const information = await models.Information.findAll();
    if (!information || information.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: 'Informasi tidak ditemukan',
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: information,
      message: "Informasi berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error retrieving information:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil informasi",
      error_code: 500,
    });
  }
};

const getInformationById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const information = await models.Information.findByPk(id);
    if (!information) {
      return res.status(404).json({
        success: false,
        data: {},
        message: 'Informasi tidak ditemukan',
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: information,
      message: "Informasi berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error retrieving information by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const createInformation = async (req, res, next) => {
  try {
    const { title, description, image_url, is_active, category } = req.body;
    const customCategory = category.toLowerCase();
    const newInformation = await models.Information.create({ title, description, image_url, is_active, category: customCategory });

    return res.status(201).json({
      success: true,
      data: newInformation,
      message: "Informasi berhasil dibuat",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error creating information:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const updateInformation = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, image_url, is_active, category } = req.body;
    const customCategory = category.toLowerCase();
    let checkInformation = await models.Information.findByPk(id);
    if (!checkInformation) {
      return res.status(404).json({
        success: false,
        message: 'Informasi tidak ditemukan',
        error_code: 404,
      });
    }
    await checkInformation.update({ title, description, image_url, is_active, category: customCategory });

    return res.status(200).json({
      success: true,
      message: "Informasi berhasil diperbarui",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating information:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const deleteInformation = async (req, res, next) => {
  const id = req.params.id;
  try {
    const information = await models.Information.findByPk(id);
    if (!information) {
      return res.status(404).json({
        success: false,
        message: 'Informasi tidak ditemukan',
        error_code: 404,
      });
    }
    await information.destroy();
    return res.status(200).json({
      success: true,
      message: "Informasi berhasil dihapus",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error deleting information:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

module.exports = {
  getAllInformation,
  getInformationById,
  createInformation,
  updateInformation,
  deleteInformation,
};
