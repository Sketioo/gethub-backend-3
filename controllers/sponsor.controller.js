const models = require("../models");

// Get all sponsors
const getAllSponsors = async (req, res) => {
  try {
    const sponsors = await models.Sponsor.findAll();
    return res.status(200).json({
      success: true,
      data: sponsors,
      message: "All sponsors retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting all sponsors:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Get sponsor by ID
const getSponsorById = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const sponsor = await models.Sponsor.findByPk(sponsorId);
    if (!sponsor) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: sponsor,
      message: "Sponsor retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting sponsor by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Create a new sponsor
const createSponsor = async (req, res) => {
  try {
    const newSponsor = req.body;
    const createdSponsor = await models.Sponsor.create(newSponsor);
    return res.status(201).json({
      success: true,
      data: createdSponsor,
      message: "Sponsor created successfully",
    });
  } catch (error) {
    console.error("Error creating sponsor:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Update sponsor by ID
const updateSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const updatedSponsorData = req.body;
    const [updatedRowsCount, updatedSponsor] = await models.Sponsor.update(updatedSponsorData, {
      where: { id: sponsorId },
      returning: true,
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedSponsor[0],
      message: "Sponsor updated successfully",
    });
  } catch (error) {
    console.error("Error updating sponsor:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Delete sponsor by ID
const deleteSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;
    const deletedRowsCount = await models.Sponsor.destroy({
      where: { id: sponsorId },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Sponsor not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Sponsor deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
