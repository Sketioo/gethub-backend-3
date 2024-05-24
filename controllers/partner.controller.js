// Import modul yang diperlukan
const { getUserId } = require("../helpers/utility");
const models = require("../models");

const getAllPartners = async (req, res) => {
  try {
    const partners = await models.Partner.findAll();
    console.log(partners);
    if (!partners || partners.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Partner tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: partners,
      error_code: 0,
      message: "Partner berhasil diambil",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kesalahan Internal Server",
      error_code: 500,
    });
  }
};
const getUserPartners = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const partners = await models.Partner.findAll({
      where: {
        user_id: user_id,
      },
    });
    console.log(partners);
    if (!partners || partners.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Partner tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: partners,
      error_code: 0,
      message: "Partner berhasil diambil",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kesalahan Internal Server",
      error_code: 500,
    });
  }
};

const getPartnerById = async (req, res) => {
  try {
    const partnerId = req.params.id;
    const partner = await models.Partner.findByPk(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: partner,
      error_code: 0,
      message: "Partner berhasil diambil",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kesalahan Internal Server",
      error_code: 500,
    });
  }
};

const createPartner = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const partnerData = req.body;
    const partner = await models.Partner.create({ ...partnerData, user_id });
    console.log(req.body);
    return res.status(201).json({
      success: true,
      data: partner,
      error_code: 0,
      message: "Partner berhasil dibuat",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kesalahan Internal Server",
      error_code: 500,
    });
  }
};

const updatePartner = async (req, res) => {
  try {
    const partnerId = req.params.id;
    const partnerData = req.body;

    const partner = await models.Partner.findByPk(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner tidak ditemukan",
        error_code: 404,
      });
    }

    await partner.update(partnerData);

    return res.status(200).json({
      success: true,
      message: "Partner berhasil diperbarui",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating partner:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan Internal Server",
      error_code: 500,
    });
  }
};

const deletePartner = async (req, res) => {
  const partnerId = req.params.id;
  try {
    const partner = await models.Partner.findByPk(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner tidak ditemukan",
        error_code: 404,
      });
    }

    const deletedRowsCount = await models.Partner.destroy({
      where: { id: partnerId },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Partner tidak ditemukan",
        error_code: 404,
      });
    }
    await partner.destroy();
    return res.status(200).json({
      success: true,
      message: "Partner berhasil dihapus",
      error_code: 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kesalahan Internal Server",
      error_code: 500,
    });
  }
};

module.exports = {
  getUserPartners,
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
};
