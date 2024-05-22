const { Certification } = require('../models');
const { getUserId } = require("../helpers/utility");

// Membuat sebuah certification
const createCertification = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const { category, title, image } = req.body;
    const newCertification = await Certification.create({ category, title, image, user_id });
    console.log(newCertification)
    if (!newCertification) {
      return res.status(400).json({
        success: false,
        message: 'Gagal membuat certification',
        error_code: 400
      })
    }
    return res.status(201).json({
      success: true,
      data: newCertification,
      message: 'Certification berhasil dibuat',
      error_code: 0
    });
  } catch (error) {
    console.error('Error creating certification:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error_code: 500
    });
  }
};

// Mendapatkan semua certification pengguna
const getUserCertifications = async (req, res) => {
  try {
    const certifications = await Certification.findAll({
      where: {
        user_id: getUserId(req)
      }
    });
    if (!certifications || certifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Certifications tidak ditemukan',
        error_code: 404
      })
    }
    return res.status(200).json({
      success: true,
      data: certifications,
      message: 'Certifications berhasil diambil',
      error_code: 0
    });
  } catch (error) {
    console.error('Error retrieving certifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil certifications',
      error_code: 500
    });
  }
};

// Mendapatkan semua certification
const getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.findAll();

    if (!certifications || certifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Certifications tidak ditemukan',
        error_code: 404
      })
    }
    return res.status(200).json({
      success: true,
      data: certifications,
      message: 'Certifications berhasil diambil',
      error_code: 0
    });
  } catch (error) {
    console.error('Error retrieving certifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil certifications',
      error_code: 500
    });
  }
};

// Mendapatkan sebuah certification berdasarkan ID
const getCertificationById = async (req, res) => {
  try {
    const certification = await Certification.findByPk(req.params.id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification tidak ditemukan',
        error_code: 404
      });
    }

    return res.status(200).json({
      success: true,
      data: certification,
      message: 'Certification berhasil diambil',
      error_code: 0
    });
  } catch (error) {
    console.error('Error retrieving certification by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil certification',
      error_code: 500
    });
  }
};

// Memperbarui sebuah certification
const updateCertification = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const certification = await Certification.findByPk(req.params.id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification tidak ditemukan',
        error_code: 404
      });
    }
    if (user_id === certification.user_id) {
      await certification.update(req.body);
      return res.status(200).json({
        success: true,
        message: 'Certification berhasil diperbarui',
        error_code: 0
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan memperbarui certification ini',
        error_code: 403
      });
    }
  } catch (error) {
    console.error('Error updating certification:', error);
    return res.status(400).json({
      success: false,
      message: 'Gagal memperbarui certification',
      error_code: 400
    });
  }
};

// Menghapus sebuah certification
const deleteCertification = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const certification = await Certification.findByPk(req.params.id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification tidak ditemukan',
        error_code: 404
      });
    }
    if (user_id === certification.user_id) {
      await certification.destroy();
      return res.status(200).json({
        success: true,
        message: 'Certification berhasil dihapus',
        error_code: 0
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan menghapus certification ini',
        error_code: 403
      });
    }
  } catch (error) {
    console.error('Error deleting certification:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus certification',
      error_code: 500
    });
  }
};

module.exports = {
  createCertification,
  getUserCertifications,
  getAllCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
};
