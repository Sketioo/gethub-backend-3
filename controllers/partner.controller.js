// Import necessary modules
const models = require("../models");

const getAllPartners = async (req, res) => {
  try {
    const partners = await models.Partner.findAll();
    console.log(partners)
    if(!partners) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Partner not found",
          error_code: 404,
        });
    }
    return res
      .status(200)
      .json({ success: true, data: partners, error_code: 0 });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error_code: 500,
      });
  }
};

const getPartnerById = async (req, res) => {
  try {
    const partnerId = req.params.id;
    const partner = await models.Partner.findByPk(partnerId);
    if (!partner) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Partner not found",
          error_code: 404,
        });
    }
    return res
      .status(200)
      .json({ success: true, data: partner, error_code: 0 });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error_code: 500,
      });
  }
};

const createPartner = async (req, res) => {
  try {
    const partnerData = req.body;
    const partner = await models.Partner.create(partnerData);
    console.log(req.body)
    return res
      .status(201)
      .json({ success: true, data: partner, error_code: 0, message: "Partner created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
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
        message: "Partner not found",
        error_code: 404,
      });
    }

    const updatedPartner = await partner.update(partnerData);

    return res.status(200).json({
      success: true,
      data: updatedPartner,
      message: "Partner updated successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating partner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error_code: 500,
    });
  }
};


const deletePartner = async (req, res) => {
  const partnerId = req.params.id;
  try {
    const partner = await models.Partner.findByPk(partnerId)
    if (!partner) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Partner not found",
          error_code: 404,
        });
    }

    const deletedRowsCount = await models.Partner.destroy({
      where: { id: partnerId },
    });
    if (deletedRowsCount === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Partner not found",
          error_code: 404,
        });
    }
    await product.destroy();
    return res
      .status(200)
      .json({
        success: true,
        data: partner,
        message: "Partner deleted successfully",
        error_code: 0,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error_code: 500,
      });
  }
};

module.exports = {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
};
