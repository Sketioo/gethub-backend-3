// Import modul yang diperlukan
const { getUserId } = require("../helpers/utility");
const models = require("../models");

const getAllPartners = async (req, res) => {
  try {
    const partners = await models.Partner.findAll();
    if (!partners || partners.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
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
    const {user_id} = getUserId(req);
    const partners = await models.Partner.findAll({
      where: {
        user_id: user_id,
      },
    });

    if (!partners || partners.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
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
        data: {},
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

const addPartner = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const { partner_id } = req.body;

    const existingPartner = await models.Partner.findOne({
      where: {
        user_id,
        partner_id,
      }
    });

    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: "Partner sudah ditambahkan sebelumnya",
        error_code: 400,
      });
    }

    const partner = await models.Partner.create({ ...req.body, ref_user_id: null, user_id });

    return res.status(201).json({
      success: true,
      data: partner,
      error_code: 0,
      message: "Partner berhasil dibuat",
    });
  } catch (error) {
    console.error("Kesalahan saat menambah partner:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan Internal Server",
      error_code: 500,
    });
  }
};


const addPartnerByQR = async (req, res) => {
  try {
    const { qr_code } = req.body;
    const {user_id} = getUserId(req);

    const refUser = await models.User.findOne({ where: { qr_code } });

    if (!refUser) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna yang direferensikan tidak ditemukan',
        error_code: 404,
      });
    }

    if (refUser.id == user_id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak bisa menambahkan diri sendiri sebagai partner',
        error_code: 403,
      });
    }

    const partner = await models.Partner.create({
      user_id: user_id,
      ref_user_id: refUser.id,
      full_name: refUser.full_name,
      profession: refUser.profession,
      email: refUser.email,
      phone: refUser.phone,
      photo: refUser.photo,
      address: refUser.address,
      website: refUser.web,
      image_url: refUser.photo,
    });

    return res.status(201).json({
      success: true,
      data: partner,
      message: 'Partner berhasil ditambahkan',
      error_code: 0,
    });
  } catch (error) {
    console.error('Terjadi kesalahan saat menambahkan mitra:', error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
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

    await partner.destroy();
    return res.status(204).send();
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
  addPartner,
  updatePartner,
  deletePartner,
  addPartnerByQR
};
