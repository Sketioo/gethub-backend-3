const models = require("../models");

const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await models.Sponsor.findAll({
      order: [['created_at', 'DESC']]
    });
    const countSponsors = await models.Sponsor.count()
    if (!sponsors || sponsors.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        total_data: countSponsors,
        message: "Semua sponsor berhasil diambil",
        error_code: 0,
      });
    }
    return res.status(200).json({
      success: true,
      data: sponsors,
      message: "Semua sponsor berhasil diambil",
      error_code: 0,
      total_data: countSponsors
    });
  } catch (error) {
    console.error("Error mengambil semua sponsor:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Mendapatkan sponsor berdasarkan ID
const getSponsorById = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const sponsor = await models.Sponsor.findByPk(sponsorId);
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        data: {},
        message: "Sponsor tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: sponsor,
      message: "Sponsor berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error mengambil sponsor berdasarkan ID:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Membuat sponsor baru
const createSponsor = async (req, res) => {
  try {
    const newSponsor = req.body;
    const createdSponsor = await models.Sponsor.create(newSponsor);
    if (!createdSponsor) {
      return res.status(500).json({ 
        success: false,
        message: "Sponsor tidak dapat dibuat",
        error_code: 500, 
      });
    }
    return res.status(201).json({ 
      success: true,
      data: createdSponsor,
      message: "Sponsor berhasil dibuat",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error membuat sponsor:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Memperbarui sponsor berdasarkan ID
const updateSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const updatedSponsorData = req.body;
    const sponsor = await models.Sponsor.findByPk(sponsorId)
    if (!sponsor) {
      return res.status(404).json({ 
        success: false,
        message: "Sponsor tidak ditemukan",
        error_code: 404, 
      });
    }
    await models.Sponsor.update(updatedSponsorData, {
      where: {
        id: sponsorId
      }
    })

    return res.status(200).json({
      success: true,
      message: "Sponsor berhasil diperbarui",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error memperbarui sponsor:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

// Menghapus sponsor berdasarkan ID
const deleteSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const deletedRowsCount = await models.Sponsor.destroy({
      where: { id: sponsorId },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Sponsor tidak ditemukan",
        error_code: 404, 
      });
    }
    return res.status(200).json({
      success: true,
      message: "Sponsor berhasil dihapus",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error menghapus sponsor:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

module.exports = {
  getAllSponsors,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor,
};
