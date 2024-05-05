// controllers/informationController.js
const models = require("../models");

const getAllInformation = async (req, res, next) => {
  try {
    const information = await models.Information.findAll();
    console.log(information)
    if (!information) {
      return res.status(404).json({
        success: false,
        message: 'Information not found',
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: information,
      message: "Information retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error retrieving informations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve informations",
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
        message: 'Information not found',
        error_code: 404,
      });
    }
    res.status(200).json({
      success: true,
      data: information,
      message: "Information retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    next(error);
  }
};

const createInformation = async (req, res, next) => {
  const { title, description, image, is_active } = req.body;
  try {
    const newInformation = await models.Information.create({ title, description, image, is_active });
    res.status(201).json({
      success: true,
      data: newInformation,
      message: "Information created successfully",
      error_code: 0,
    });
  } catch (error) {
    next(error);
  }
};

const updateInformation = async (req, res, next) => {
  const id = req.params.id;
  const { title, description, image, is_active } = req.body;
  try {
    let information = await models.Information.findByPk(id);
    if (!information) {
      return res.status(404).json({
        success: false,
        message: 'Information not found',
        error_code: 404,
      });
    }
    await models.Informationinformation.update({ title, description, image, is_active });
    information = await models.Information.findByPk(id); // Fetch updated information
    res.status(200).json({
      success: true,
      data: information,
      message: "Information updated successfully",
      error_code: 0,
    });
  } catch (error) {
    next(error);
  }
};

const deleteInformation = async (req, res, next) => {
  const id = req.params.id;
  try {
    const information = await models.Information.findByPk(id);
    if (!information) {
      return res.status(404).json({
        success: false,
        message: 'Information not found',
        error_code: 404,
      });
    }
    await models.Informationinformation.destroy();
    res.status(200).json({
      success: true,
      message: "Information deleted successfully",
      error_code: 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInformation,
  getInformationById,
  createInformation,
  updateInformation,
  deleteInformation,
};
