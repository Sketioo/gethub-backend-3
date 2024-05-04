const models = require("../models");

// Create new enumeration
const createEnumeration = async (req, res) => {
  try {
    const { key, value } = req.body;
    const enumeration = await models.Enumeration.create({ key, value });
    return res.status(201).json({
      success: true,
      data: enumeration,
      message: "Enumeration created successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error creating enumeration:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Get all enumerations
const getAllEnumerations = async (req, res) => {
  try {
    const enumerations = await models.Enumeration.findAll();
    return res.status(200).json({
      success: true,
      data: enumerations,
      message: "All enumerations retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error getting all enumerations:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Get enumeration by ID
const getEnumerationById = async (req, res) => {
  try {
    const enumerationId = req.params.id;
    const enumeration = await models.Enumeration.findByPk(enumerationId);
    if (!enumeration) {
      return res.status(404).json({
        success: false,
        message: "Enumeration not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: enumeration,
      message: "Enumeration retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error getting enumeration by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Update enumeration
const updateEnumeration = async (req, res) => {
  try {
    const enumerationId = req.params.id;
    const { key, value } = req.body;
    
    const enumeration = await models.Enumeration.findByPk(enumerationId);
    if (!enumeration) {
      return res.status(404).json({
        success: false,
        message: "Enumeration not found",
        error_code: 404,
      });
    }
    const updatedEnumeration = await enumeration.update({ key, value });

    return res.status(200).json({
      success: true,
      message: "Enumeration updated successfully",
      data: updatedEnumeration,
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating enumeration:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};


const deleteEnumeration = async (req, res) => {
  try {
    const enumerationId = req.params.id;
    const deletedEnumeration = await models.Enumeration.findByPk(enumerationId);
    console.log(deletedEnumeration);
    if (!deletedEnumeration) {
      return res.status(404).json({
        success: false,
        message: "Enumeration not found",
        error_code: 404,
      });
    }
    await deletedEnumeration.destroy();
    return res.status(200).json({
      success: true,
      message: "Enumeration deleted successfully",
      data: deletedEnumeration,
      error_code: 0,
    });
  } catch (error) {
    console.error("Error deleting enumeration:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
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
};
