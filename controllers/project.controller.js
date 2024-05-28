const models = require('../models');
const { formatDates } = require('../helpers/utility');
const { differenceInDays } = require('date-fns')
const { Op } = require('sequelize');
const { getUserId } = require("../helpers/utility");


const getUserJobStatsAndBids = async (req, res) => {
  try {
    const userId = getUserId(req);

    const jobPostedCount = await models.Project.count({
      where: { owner_id: userId }
    });

    const bidsMadeCount = await models.Project_User_Bid.count({
      where: { user_id: userId }
    });

    const bidsAcceptedCount = await models.Project_User_Bid.count({
      where: {
        user_id: userId,
        is_selected: true
      }
    });

    const bids = await models.Project_User_Bid.findAll({
      where: {
        user_id: userId,
        is_selected: false
      },
      include: [
        {
          model: models.Project,
          as: 'project',
          include: [
            {
              model: models.User,
              as: 'owner_project',
              attributes: ['id', 'full_name', 'username', 'email', 'photo', 'profession']
            }
          ]
        }
      ]
    });

    if (!bids || bids.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Informasi job bidding dan daftar proyek yang dibid tidak ditemukan",
        error_code: 200
      });
    }

    const bidProjects = bids.map(bid => {
      const projectData = {
        projectId: bid.project.id,
        title: bid.project.title,
        owner: {
          id: bid.project.owner_project.id,
          full_name: bid.project.owner_project.full_name,
          username: bid.project.owner_project.username,
          email: bid.project.owner_project.email,
          photo: bid.project.owner_project.photo,
          profession: bid.project.owner_project.profession
        },
        min_budget: bid.project.min_budget,
        max_budget: bid.project.max_budget,
        min_deadline: bid.project.min_deadline,
        max_deadline: bid.project.max_deadline,
        created_date: bid.project.created_date,
        is_selected: bid.is_selected
      };

      const formattedProjectData = formatDates(projectData, ['min_deadline', 'max_deadline', 'created_date']);
      const daysDifference = differenceInDays(new Date(bid.project.max_deadline), new Date(bid.project.min_deadline));
      formattedProjectData.deadline_duration = `${daysDifference}d`;

      return formattedProjectData;
    });

    return res.status(200).json({
      success: true,
      data: {
        job_posted: jobPostedCount,
        bids_made: bidsMadeCount,
        bids_accepted: bidsAcceptedCount,
        bid_projects: bidProjects,
        total_bidders: bidProjects.length
      },
      message: "Informasi job bidding dan daftar proyek yang dibid berhasil diambil",
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil informasi job bidding dan daftar proyek yang dibid:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
};


const postProject = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const checkOwner = await models.User.findByPk(user_id, {
      where: [{ include: models.Category, as: 'category', attributes: ['name'] }]
    });

    if (!checkOwner) {
      return res.status(404).json({
        success: false,
        message: "Pemilik tidak ditemukan",
        error_code: 404,
      });
    }

    const project = await models.Project.create({ ...req.body, owner_id: user_id });

    const formattedProject = formatDates(project.toJSON(), ['min_deadline', 'max_deadline', 'created_date']);

    return res.status(201).json({
      success: true,
      data: formattedProject,
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
    const projects = await models.Project.findAll({
      include: [
        { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo'] },
        { model: models.Category, as: 'category', attributes: ['name'] }
      ]
    });
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan!",
        error_code: 404
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        projects,
        total_projects: projects.length
      },
      message: "Proyek berhasil diambil",
      error_code: 0
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


const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const project = await models.Project.findByPk(id, {
      include: [
        { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo'] },
        { model: models.Category, as: 'category', attributes: ['name'] },
      ]
    });
    console.log(project)

    const bids = await models.Project_User_Bid.findAll({
      where: { project_id: id },
      include: [
        { model: models.User, as: 'users_bid', attributes: ['full_name', 'username', 'profession', 'photo'] }
      ]
    });

    if (!project || !bids || bids.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan",
        error_code: 404
      });
    }

    const usersBid = bids.map(bid => bid.users_bid).filter(user => user);

    const formattedProject = formatDates(project.toJSON(), ['min_deadline', 'max_deadline', 'created_date']);

    const responseData = {
      ...formattedProject,
      users_bid: usersBid,
      total_bidders: usersBid.length,
      deadline_duration: project.deadline_duration
    };

    return res.status(200).json({
      success: true,
      data: responseData,
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
      where: { owner_id: owner_id },
      include: [{ model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo'] }]
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan!",
        error_code: 404
      });
    }

    const dateFields = ['min_deadline', 'max_deadline', 'created_date'];

    const formattedProjects = projects.map(project => {
      return formatDates(project.toJSON(), dateFields, 'd-MMM-yyyy');
    });

    return res.status(200).json({
      success: true,
      data: formattedProjects,
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
        as: 'project',
        include: [{
          model: models.User,
          as: 'owner_project',
          attributes: ['full_name', 'username', 'email', 'photo']
        }]
      }]
    });

    if (!userProjectBids || userProjectBids.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Tawaran proyek pengguna tidak ditemukan",
        error_code: 404,
      });
    }

    const totalBids = await models.Project_User_Bid.count({
      where: { user_id: userIdLogin }
    });

    return res.status(200).json({
      success: true,
      data: {
        users_bid: userProjectBids,
        total_bids: totalBids,
      },
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
    const { id } = req.params;
    const userId = getUserId(req);
    const { freelancer_id } = req.body;

    const project = await models.Project.findOne({
      where: {
        id: id,
        owner_id: userId
      }
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk memilih bidder untuk proyek ini",
        error_code: 403,
      });
    }

    const projectBid = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
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

    if (!userSelectedProjectBids || userSelectedProjectBids.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Tawaran proyek yang dipilih pengguna tidak ditemukan",
        error_code: 404,
      });
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

const getProjectList = async (req, res) => {
  try {
    const { title, category, min_budget, max_budget } = req.query;

    const searchConditions = {};

    if (title) {
      searchConditions.title = { [Op.like]: `%${title}%` };
    }

    if (category) {
      searchConditions.category_id = category;
    }

    if (min_budget) {
      if (!searchConditions.min_budget) searchConditions.min_budget = {};
      searchConditions.min_budget[Op.gte] = parseFloat(min_budget);
    }

    if (max_budget) {
      if (!searchConditions.max_budget) searchConditions.max_budget = {};
      searchConditions.max_budget[Op.lte] = parseFloat(max_budget);
    }

    const projects = await models.Project.findAll({
      where: searchConditions,
      include: [
        {
          model: models.User,
          as: 'owner_project',
          attributes: ['full_name', 'username', 'email', 'photo']
        },
        {
          model: models.Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    });

    if (projects.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan",
        error_code: 200
      });
    }

    return res.status(200).json({
      success: true,
      data: projects,
      message: "Daftar proyek berhasil diambil",
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil daftar proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
};

const searchProjectsByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Masukan title project",
        error_code: 400,
      });
    }

    const projects = await models.Project.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        }
      },
      include: [
        {
          model: models.User,
          as: 'owner_project',
          attributes: ['full_name', 'username', 'profession', 'photo']
        },
        {
          model: models.Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    });


    if (!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan!",
        error_code: 404,
      });
    }

    const formattedProjects = projects.map(project =>
      formatDates(project.toJSON(), ["min_deadline", "max_deadline", "created_date"])
    );

    return res.status(200).json({
      success: true,
      data: { projects: formattedProjects },
      message: "Proyek berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mencari proyek:", error);
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
    });

    if (project) {
      return res.status(403).json({
        success: false,
        message: "Anda adalah pemilik proyek ini",
        error_code: 403,
      });
    }

    const projectBid = await models.Project_User_Bid.create({ ...req.body, user_id });

    if (!projectBid) {
      return res.status(400).json({
        success: false,
        message: "Gagal membuat tawaran proyek",
        error_code: 400,
      });
    }

    return res.status(201).json({
      success: true,
      data: projectBid,
      message: "Tawaran proyek berhasil dibuat",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat membuat tawaran proyek:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};


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

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Ulasan tidak ditemukan",
        error_code: 200,
      })
    }

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

const getProjectReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectReview = await models.Project_Review.findByPk(id);
    if (!projectReview) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Ulasan proyek tidak ditemukan",
        error_code: 200,
      });
    }
    res.status(200).json({
      success: true,
      data: projectReview,
      message: "Ulasan proyek berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error fetching project review:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil ulasan proyek",
      error_code: 500,
    });
  }
};

const updateProjectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, sentiment, sentiment_score } = req.body;
    const projectReview = await models.Project_Review.findByPk(id);
    if (!projectReview) {
      return res.status(404).json({
        success: false,
        message: "Ulasan proyek tidak ditemukan",
        error_code: 404,
      });
    }
    await projectReview.update({ message, sentiment, sentiment_score });
    res.status(200).json({
      success: true,
      data: projectReview,
      message: "Ulasan proyek berhasil diperbarui",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating project review:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui ulasan proyek",
      error_code: 500,
    });
  }
};

const deleteProjectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const projectReview = await models.Project_Review.findByPk(id);
    if (!projectReview) {
      return res.status(404).json({
        success: false,
        message: "Ulasan proyek tidak ditemukan",
        error_code: 404,
      });
    }
    await projectReview.destroy();
    res.status(200).json({
      success: true,
      message: "Ulasan proyek berhasil dihapus",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error deleting project review:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus ulasan proyek",
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

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Ulasan proyek freelance tidak ditemukan",
        error_code: 200
      })
    }

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

const getProjectReviewFreelanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectReviewFreelance = await models.Project_Review_Freelance.findByPk(id);
    if (!projectReviewFreelance) {
      return res.status(200).json({
        success: false,
        message: "Ulasan proyek untuk freelance tidak ditemukan",
        error_code: 200,
      });
    }
    res.status(200).json({
      success: true,
      data: projectReviewFreelance,
      message: "Ulasan proyek untuk freelance berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error fetching project review for freelance:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil ulasan proyek untuk freelance",
      error_code: 500,
    });
  }
};

const updateProjectReviewFreelance = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, sentiment, sentiment_score } = req.body;
    const projectReviewFreelance = await models.Project_Review_Freelance.findByPk(id);
    if (!projectReviewFreelance) {
      return res.status(200).json({
        success: false,
        message: "Ulasan proyek untuk freelance tidak ditemukan",
        error_code: 200,
      });
    }
    await projectReviewFreelance.update({ message, sentiment, sentiment_score });
    res.status(200).json({
      success: true,
      data: projectReviewFreelance,
      message: "Ulasan proyek untuk freelance berhasil diperbarui",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating project review for freelance:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui ulasan proyek untuk freelance",
      error_code: 500,
    });
  }
};

const deleteProjectReviewFreelance = async (req, res) => {
  try {
    const { id } = req.params;
    const projectReviewFreelance = await models.Project_Review_Freelance.findByPk(id);
    if (!projectReviewFreelance) {
      return res.status(200).json({
        success: false,
        message: "Ulasan proyek untuk freelance tidak ditemukan",
        error_code: 200,
      });
    }
    await projectReviewFreelance.destroy();
    res.status(200).json({
      success: true,
      message: "Ulasan proyek untuk freelance berhasil dihapus",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error deleting project review for freelance:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus ulasan proyek untuk freelance",
      error_code: 500,
    });
  }
};


const getProjectBidders = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await models.Project.findByPk(id, {
      include: [
        { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo'] },
        { model: models.Category, as: 'category', attributes: ['name'] }
      ]
    });

    if (!project) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Proyek tidak ditemukan",
        error_code: 200,
      });
    }

    const bids = await models.Project_User_Bid.findAll({
      where: { project_id: id },
      include: [
        { model: models.User, as: 'users_bid', attributes: ['full_name', 'username', 'profession', 'photo'] }
      ]
    });

    if (!bids || bids.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "Tidak ada penawar untuk proyek ini",
        error_code: 200,
      })
    }

    const formattedProject = formatDates(project.toJSON(), ['min_deadline', 'max_deadline', 'created_date']);

    const bidders = bids.map(bid => bid.users_bid).filter(user => user !== null);

    const responseData = {
      ...formattedProject,
      users_bid: bidders,
      total_bidders: bidders.length
    };

    return res.status(200).json({
      success: true,
      data: responseData,
      message: "Detail proyek dan informasi penawar berhasil diambil",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil detail proyek dan informasi penawar:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
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
  getProjectList,
  getProjectBidders,
  getUserJobStatsAndBids,
  searchProjectsByTitle,
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
