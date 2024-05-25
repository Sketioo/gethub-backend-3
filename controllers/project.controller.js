const models = require('../models');
const { Op } = require('sequelize');
const { getUserId } = require("../helpers/utility");

const postProject = async (req, res) => {
  try {
    const owner_id = getUserId(req);
    const checkOwner = await models.User.findByPk(owner_id, {
      where: [{ include: models.Category }]
    });
    if (!checkOwner) {
      return res.status(404).json({
        success: false,
        message: "Pemilik tidak ditemukan",
        error_code: 404,
      });
    }
    const project = await models.Project.create({ ...req.body, owner_id });
    return res.status(201).json({
      success: true,
      data: project,
      message: "Proyek berhasil diposting",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat memposting proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const postTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await models.Project_Task.create({ ...req.body, project_id: id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tugas tidak dapat dibuat",
        error_code: 404
      })
    }
    return res.status(201).json({
      success: true,
      data: task,
      message: "Tugas berhasil diposting",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat memposting tugas:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
}

const getAllProjects = async (req, res) => {
  try {
    const projects = await models.Project.findAll();
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan!",
        error_code: 404
      })
    }
    return res.status(200).json({
      success: true,
      data: projects,
      message: "Proyek berhasil diambil",
      error_code: 0
    })
  } catch (error) {
    console.error("Kesalahan saat mengambil semua proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    })
  }
}

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const project = await models.Project.findByPk(id, {
      include: [
        { model: models.User, as: 'owner', attributes: ['id', 'full_name', 'username', 'email'] },
        { model: models.Category, attributes: ['id', 'name'] }
      ]
    });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: project,
      message: "Detail proyek berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil detail proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getOwnerProjects = async (req, res) => {
  try {
    const owner_id = getUserId(req);
    const projects = await models.Project.findAll({
      where: { owner_id }
    });
    console.log(owner_id)
    console.log(projects)
    return res.status(200).json({
      success: true,
      data: projects,
      message: "Proyek berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil proyek pemilik:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getUserProjectBids = async (req, res) => {
  try {
    const userIdLogin = getUserId(req);
    const userProjectBids = await models.Project_User_Bid.findAll({
      where: { user_id: userIdLogin },
      include: [{
        model: models.Project,
        as: 'project'
      }]
    });

    if (!userProjectBids) {
      return res.status(404).json({
        success: false,
        message: "Tawaran proyek pengguna tidak ditemukan",
        error_code: 404,
      })
    }

    return res.status(200).json({
      success: true,
      data: userProjectBids,
      message: "Tawaran proyek pengguna berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil tawaran proyek pengguna:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const ownerSelectBidder = async (req, res) => {
  try {
    const { project_id, freelancer_id } = req.body;

    const projectBid = await models.Project_User_Bid.findOne({
      where: {
        project_id: project_id,
        user_id: freelancer_id
      }
    });

    if (!projectBid) {
      return res.status(404).json({
        success: false,
        message: "Tawaran proyek tidak ditemukan",
        error_code: 404,
      });
    }

    projectBid.is_selected = true;

    await projectBid.save();

    return res.status(200).json({
      success: true,
      data: projectBid,
      message: "Freelancer berhasil dipilih",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat memilih freelancer:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getUserSelectedProjectBids = async (req, res) => {
  try {
    const userIdLogin = getUserId(req);
    const userSelectedProjectBids = await models.Project_User_Bid.findAll({
      where: {
        user_id: userIdLogin,
        is_selected: true
      },
      include: [{
        model: models.Project,
        as: 'project'
      }]
    });

    if (!userSelectedProjectBids) {
      return res.status(404).json({
        success: false,
        message: "Tawaran proyek yang dipilih pengguna tidak ditemukan",
        error_code: 404,
      })
    }
    return res.status(200).json({
      success: true,
      data: userSelectedProjectBids,
      message: "Tawaran proyek yang dipilih pengguna berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil tawaran proyek yang dipilih pengguna:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const getListProjects = async (req, res) => {
  try {
    const { title, category, min_price, max_price } = req.query;

    const where = { is_active: true };

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }

    let categoryFilter = {};
    if (category) {
      categoryFilter.name = { [Op.like]: `%${category}%` };
    }

    if (min_price) {
      where.min_budget = { [Op.gte]: parseFloat(min_price) };
    }

    if (max_price) {
      if (!where.min_budget) {
        where.min_budget = {};
      }
      where.min_budget[Op.lte] = parseFloat(max_price);
    }
    console.log(categoryFilter)
    const projects = await models.Project.findAll({
      where,
      include: [{
        model: models.Category,
        where: category,
        attributes: []
      }]
    });

    return res.status(200).json({
      success: true,
      data: projects,
      message: 'Projects fetched successfully',
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil semua proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};

const postBid = async (req, res) => {
  try {
    const user_id = getUserId(req);

    const project = await models.Project.findOne({
      where: {
        owner_id: user_id
      }
    })
    if (!project) {
      const projectBid = await models.Project_User_Bid.create({ ...req.body, user_id });
      if (!projectBid) {
        return res.status(400).json({
          success: false,
          message: "Gagal membuat tawaran proyek",
          error_code: 400,
        })
      }
      return res.status(200).json({
        success: true,
        data: projectBid,
        message: "Tawaran proyek berhasil dibuat",
        error_code: 0,
      })
    } else {
      return res.status(403).json({
        success: false,
        message: "Anda adalah pemilik proyek ini",
        error_code: 403,
      })
    }
  } catch (error) {
    console.error("Kesalahan saat membuat tawaran proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    })
  }
}

//! PROJECT OWNER

// Create a project review
const createProjectReview = async (req, res) => {
  try {
    const { project_id, owner_id, freelance_id, message, sentiment, sentiment_score } = req.body;

    const projectReview = await models.Project_Review.create({
      project_id,
      owner_id,
      freelance_id,
      message,
      sentiment,
      sentiment_score
    });

    const reviews = await models.Project_Review.findAll({
      where: { owner_id }
    });

    let totalPositif = 0;
    let totalNegatif = 0;
    let totalNetral = 0;

    reviews.forEach(review => {
      if (review.sentiment === 'Positif') {
        totalPositif++;
      } else if (review.sentiment === 'Negatif') {
        totalNegatif++;
      } else if (review.sentiment === 'Netral') {
        totalNetral++;
      }
    });

    let sentimentResult = '';
    let totalSentimentResult = 0;

    if (totalPositif > totalNegatif) {
      sentimentResult = 'Positif';
      totalSentimentResult = totalPositif;
    }

    const user = await models.User.findByPk(owner_id);
    if (user) {
      user.sentiment_owner_analisis = sentimentResult;
      user.sentiment_owner_score = totalSentimentResult;
      await user.save();
    }

    return res.status(201).json({
      success: true,
      data: projectReview,
      message: 'Ulasan proyek berhasil dibuat',
      error_code: 0,
    });
  } catch (error) {
    console.error('Kesalahan saat membuat ulasan proyek:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat ulasan proyek',
      error_code: 500,
    });
  }
};

// Get project review by ID
const getProjectReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectReview = await models.Project_Review.findByPk(id);
    if (!projectReview) {
      return res.status(404).json({
        success: false,
        message: "Project review not found",
        error_code: 404,
      });
    }
    res.status(200).json({
      success: true,
      data: projectReview,
      message: "Project review fetched successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error fetching project review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project review",
      error_code: 500,
    });
  }
};

// Update project review
const updateProjectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, sentiment, sentiment_score } = req.body;
    const projectReview = await models.Project_Review.findByPk(id);
    if (!projectReview) {
      return res.status(404).json({
        success: false,
        message: "Project review not found",
        error_code: 404,
      });
    }
    await projectReview.update({ message, sentiment, sentiment_score });
    res.status(200).json({
      success: true,
      data: projectReview,
      message: "Project review updated successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating project review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project review",
      error_code: 500,
    });
  }
};

// Delete project review
const deleteProjectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const projectReview = await models.Project_Review.findByPk(id);
    if (!projectReview) {
      return res.status(404).json({
        success: false,
        message: "Project review not found",
        error_code: 404,
      });
    }
    await projectReview.destroy();
    res.status(200).json({
      success: true,
      message: "Project review deleted successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error deleting project review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project review",
      error_code: 500,
    });
  }
};

//! Freelancer Review

// Create a project review for a freelance
const createFreelancerReview = async (req, res) => {
  try {
    const { project_id, owner_id, freelance_id, message, sentiment, sentiment_score } = req.body;

    const projectReview = await models.Project_Review.create({
      project_id,
      owner_id,
      freelance_id,
      message,
      sentiment,
      sentiment_score
    });

    const reviews = await models.Project_Review.findAll({
      where: { freelance_id }
    });

    let totalPositif = 0;
    let totalNegatif = 0;
    let totalNetral = 0;

    reviews.forEach(review => {
      if (review.sentiment === 'Positif') {
        totalPositif++;
      } else if (review.sentiment === 'Negatif') {
        totalNegatif++;
      } else if (review.sentiment === 'Netral') {
        totalNetral++;
      }
    });

    let sentimentResult = '';
    let totalSentimentResult = 0;

    if (totalPositif > totalNegatif) {
      sentimentResult = 'Positif';
      totalSentimentResult = totalPositif;
    }

    const user = await models.User.findByPk(freelance_id);
    if (user) {
      user.sentiment_owner_analisis = sentimentResult;
      user.sentiment_owner_score = totalSentimentResult;
      await user.save();
    }

    return res.status(201).json({
      success: true,
      data: projectReview,
      message: 'Ulasan proyek berhasil dibuat',
      error_code: 0,
    });
  } catch (error) {
    console.error('Kesalahan saat membuat ulasan proyek:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat ulasan proyek',
      error_code: 500,
    });
  }
};

// Get project review for freelance by ID
const getProjectReviewFreelanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectReviewFreelance = await models.Project_Review_Freelance.findByPk(id);
    if (!projectReviewFreelance) {
      return res.status(404).json({
        success: false,
        message: "Project review for freelance not found",
        error_code: 404,
      });
    }
    res.status(200).json({
      success: true,
      data: projectReviewFreelance,
      message: "Project review for freelance fetched successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error fetching project review for freelance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project review for freelance",
      error_code: 500,
    });
  }
};

// Update project review for freelance
const updateProjectReviewFreelance = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, sentiment, sentiment_score } = req.body;
    const projectReviewFreelance = await models.Project_Review_Freelance.findByPk(id);
    if (!projectReviewFreelance) {
      return res.status(404).json({
        success: false,
        message: "Project review for freelance not found",
        error_code: 404,
      });
    }
    await projectReviewFreelance.update({ message, sentiment, sentiment_score });
    res.status(200).json({
      success: true,
      data: projectReviewFreelance,
      message: "Project review for freelance updated successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating project review for freelance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project review for freelance",
      error_code: 500,
    });
  }
};

// Delete project review for freelance
const deleteProjectReviewFreelance = async (req, res) => {
  try {
    const { id } = req.params;
    const projectReviewFreelance = await models.Project_Review_Freelance.findByPk(id);
    if (!projectReviewFreelance) {
      return res.status(404).json({
        success: false,
        message: "Project review for freelance not found",
        error_code: 404,
      });
    }
    await projectReviewFreelance.destroy();
    res.status(200).json({
      success: true,
      message: "Project review for freelance deleted successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error deleting project review for freelance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project review for freelance",
      error_code: 500,
    });
  }
};


module.exports = {
  postProject,
  getOwnerProjects,
  getUserProjectBids,
  getUserSelectedProjectBids,
  postBid,
  getProjectById,
  ownerSelectBidder,
  getAllProjects,
  postTask,
  getListProjects,
  //*Project Owner review
  createProjectReview,
  getProjectReviewById,
  updateProjectReview,
  deleteProjectReview,
  //*Freelancer review 
  createFreelancerReview,
  getProjectReviewFreelanceById,
  updateProjectReviewFreelance,
  deleteProjectReviewFreelance,
};
