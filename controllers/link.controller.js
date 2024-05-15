const { Link } = require('../models');
const { getUserId } = require("../helpers/utility")

// Create a link
const createLink = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const { category, link } = req.body
    const newLink = await Link.create({ category, link, user_id });
    return res.status(201).json({
      success: true,
      data: newLink,
      message: 'Link created successfully',
      error_code: 0
    });
  } catch (error) {
    console.error('Error creating link:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to create link',
      error_code: 400
    });
  }
};

// Get all links
const getUserLinks = async (req, res) => {
  try {
    const links = await Link.findAll({
      where: {
        user_id: getUserId(req)
      }
    });
    return res.status(200).json({
      success: true,
      data: links,
      message: 'Links retrieved successfully',
      error_code: 0
    });
  } catch (error) {
    console.error('Error retrieving links:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve links',
      error_code: 500
    });
  }
};

const getAllLinks = async (req, res) => {
  try {
    const links = await Link.findAll();
    return res.status(200).json({
      success: true,
      data: links,
      message: 'Links retrieved successfully',
      error_code: 0
    });
  } catch (error) {
    console.error('Error retrieving links:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve links',
      error_code: 500
    });
  }
};

// Get a link by ID
const getLinkById = async (req, res) => {
  try {
    const user_id = getUserId(req)
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
        error_code: 404
      });
    }

    if (user_id === link.user_id) {
      return res.status(200).json({
        success: true,
        data: link,
        message: 'Link retrieved successfully',
        error_code: 0
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this link',
        error_code: 403
      })
    }
  } catch (error) {
    console.error('Error retrieving link by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve link',
      error_code: 500
    });
  }
};

// Update a link
const updateLink = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
        error_code: 404
      });
    }
    if (user_id === link.user_id) {
      await link.update(req.body);
      return res.status(200).json({
        success: true,
        data: link,
        message: 'Link updated successfully',
        error_code: 0
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this link',
        error_code: 403
      })
    }
  } catch (error) {
    console.error('Error updating link:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to update link',
      error_code: 400
    });
  }
};

// Delete a link
const deleteLink = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found',
        error_code: 404
      });
    }
    if(user_id === link.user_id) {
      await link.destroy();
      return res.status(200).json({
        success: true,
        data: link,
        message: 'Link deleted successfully',
        error_code: 0
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this link',
        error_code: 403
      })
    }
  } catch (error) {
    console.error('Error deleting link:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete link',
      error_code: 500
    });
  }
};

module.exports = {
  createLink,
  getUserLinks,
  getAllLinks,
  getLinkById,
  updateLink,
  deleteLink,
};
