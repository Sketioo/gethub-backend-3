const { Link } = require('../models');

// Create a link
const createLink = async (req, res) => {
  try {
    const link = await Link.create(req.body);
    return res.status(201).json({
      success: true,
      data: link,
      message: 'Link created successfully',
    });
  } catch (error) {
    console.error('Error creating link:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to create link',
    });
  }
};

// Get all links
const getLinks = async (req, res) => {
  try {
    const links = await Link.findAll();
    return res.status(200).json({
      success: true,
      data: links,
      message: 'Links retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving links:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve links',
    });
  }
};

// Get a link by ID
const getLinkById = async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
      });
    }
    return res.status(200).json({
      success: true,
      data: link,
      message: 'Link retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving link by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve link',
    });
  }
};

// Update a link
const updateLink = async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
      });
    }
    await link.update(req.body);
    return res.status(200).json({
      success: true,
      data: link,
      message: 'Link updated successfully',
    });
  } catch (error) {
    console.error('Error updating link:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to update link',
    });
  }
};

// Delete a link
const deleteLink = async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
      });
    }
    await link.destroy();
    return res.status(200).json({
      success: true,
      data: link,
      message: 'Link deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete link',
    });
  }
};

module.exports = {
  createLink,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
};
