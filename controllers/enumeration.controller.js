const models = require("../models");

// Buat enumerasi baru
const createEnumeration = async (req, res) => {
  try {
    const { key, value } = req.body;
    const enumeration = await models.Enumeration.create({ key, value });
    return res.status(201).json({
      success: true,
      data: enumeration,
      message: "Enumerasi berhasil dibuat",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error creating enumeration:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan!",
      error_code: 500,
    });
  }
};

// Dapatkan semua enumerasi
const getAllEnumerations = async (req, res) => {
  try {
    const enumerations = await models.Enumeration.findAll();
    if (!enumerations || enumerations.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Semua enumerasi tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: enumerations,
      message: "Semua enumerasi berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error getting all enumerations:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Dapatkan enumerasi berdasarkan ID
const getEnumerationById = async (req, res) => {
  try {
    const enumerationId = req.params.id;
    const enumeration = await models.Enumeration.findByPk(enumerationId);
    if (!enumeration) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Enumerasi tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: enumeration,
      message: "Enumerasi berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error getting enumeration by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Perbarui enumerasi
const updateEnumeration = async (req, res) => {
  try {
    const enumerationId = req.params.id;
    const { key, value } = req.body;
    
    const enumeration = await models.Enumeration.findByPk(enumerationId);
    if (!enumeration) {
      return res.status(404).json({
        success: false,
        message: "Enumerasi tidak ditemukan",
        error_code: 404,
      });
    }
    await enumeration.update({ key, value });

    return res.status(200).json({
      success: true,
      message: "Enumerasi berhasil diperbarui",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating enumeration:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Menghapus enumerasi
const deleteEnumeration = async (req, res) => {
  try {
    const enumerationId = req.params.id;
    const deletedEnumeration = await models.Enumeration.findByPk(enumerationId);
    if (!deletedEnumeration) {
      return res.status(404).json({
        success: false,
        message: "Enumerasi tidak ditemukan",
        error_code: 404,
      });
    }
    await deletedEnumeration.destroy();
    return res.status(200).json({
      success: true,
      message: "Enumerasi berhasil dihapus",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error deleting enumeration:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Dapatkan enumerasi berdasarkan kriteria
const getEnumerationsByCriteria = async (req, res) => {
  try {
    const enumerations = await models.Enumeration.findAll({
      where: {
        key: req.query.key
      }
    });
    if (!enumerations || enumerations.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Enumerasi tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: enumerations,
      message: "Enumerasi by key berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error getting enumerations by key:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

module.exports = {
  createEnumeration,
  getAllEnumerations,
  getEnumerationById,
  updateEnumeration,
  deleteEnumeration,
  getEnumerationsByCriteria
};
