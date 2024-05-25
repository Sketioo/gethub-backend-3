const { Link } = require('../models');
const { getUserId } = require("../helpers/utility");

// Membuat sebuah link
const createLink = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const { category, link } = req.body;
    const customCategory = category.toLowerCase()
    const newLink = await Link.create({ category: customCategory, link, user_id });
    if(!newLink) {
      return res.status(400).json({
        success: false,
        message: 'Gagal membuat link',
        error_code: 400
      })
    }
    return res.status(201).json({
      success: true,
      data: newLink,
      message: 'Link berhasil dibuat',
      error_code: 0
    });
  } catch (error) {
    console.error('Error creating link:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error_code: 500
    });
  }
};

// Mendapatkan semua link pengguna
const getUserLinks = async (req, res) => {
  try {
    const links = await Link.findAll({
      where: {
        user_id: getUserId(req)
      }
    });
    if(!links || links.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Link tidak ditemukan',
        error_code: 404
      })
    }
    return res.status(200).json({
      success: true,
      data: links,
      message: 'Link berhasil diambil',
      error_code: 0
    });
  } catch (error) {
    console.error('Error retrieving links:', error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
      error_code: 500
    });
  }
};


// Mendapatkan semua link
const getAllLinks = async (req, res) => {
  try {
    const links = await Link.findAll();
    if(!links || links.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Link tidak ditemukan',
        error_code: 404
      })
    }
    return res.status(200).json({
      success: true,
      data: links,
      message: 'Link berhasil diambil',
      error_code: 0
    });
  } catch (error) {
    console.error('Error retrieving links:', error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
      error_code: 500
    });
  }
};

// Mendapatkan sebuah link berdasarkan ID
const getLinkById = async (req, res) => {
  try {
    const link = await Link.findByPk(req.params.id);
    if (!link || link === 0) {
      return res.status(404).json({
        success: false,
        message: 'Link tidak ditemukan',
        error_code: 404
      });
    }

    return res.status(200).json({
      success: true,
      data: link,
      message: 'Link berhasil diambil',
      error_code: 0
    });
  } catch (error) {
    console.error('Error retrieving link by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
      error_code: 500
    });
  }
};

// Memperbarui sebuah link
const updateLink = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link tidak ditemukan',
        error_code: 404
      });
    }
    if (user_id === link.user_id) {
      const {category} = rq.body;
      const customCategory = category.toLowerCase();
      await link.update({...req.body, category: customCategory});
      return res.status(200).json({
        success: true,
        message: 'Link berhasil diperbarui',
        error_code: 0
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan memperbarui link ini',
        error_code: 403
      });
    }
  } catch (error) {
    console.error('Error updating link:', error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
      error_code: 500
    });
  }
};

// Menghapus sebuah link
const deleteLink = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const link = await Link.findByPk(req.params.id);
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link tidak ditemukan',
        error_code: 404
      });
    }
    if (user_id === link.user_id) {
      await link.destroy();
      return res.status(200).json({
        success: true,
        message: 'Link berhasil dihapus',
        error_code: 0
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan menghapus link ini',
        error_code: 403
      });
    }
  } catch (error) {
    console.error('Error deleting link:', error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
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
