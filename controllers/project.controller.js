const models = require('../models');
const { formatDates } = require('../helpers/utility');
const { differenceInDays } = require('date-fns')
const { Op } = require('sequelize');
const { getUserId } = require("../helpers/utility");


const getUserJobStatsAndBids = async (req, res) => {
  try {
    const { user_id } = getUserId(req);

    const jobPostedCount = await models.Project.count({
      where: { owner_id: user_id }
    });

    const bidsMadeCount = await models.Project_User_Bid.count({
      where: { user_id: user_id }
    });

    const bidsAcceptedCount = await models.Project_User_Bid.count({
      where: {
        user_id: user_id,
        is_selected: true
      }
    });

    const bids = await models.Project_User_Bid.findAll({
      where: {
        user_id: user_id,
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
      return res.status(404).json({
        success: false,
        message: "Informasi job bidding dan daftar proyek yang dibid tidak ditemukan",
        data: [],
        error_code: 404
      });
    }

    const bidProjects = bids.map(bid => {
      const projectData = {
        projectId: bid.project.id,
        title: bid.project.title,
        description: bid.project.description,
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
    const { user_id } = getUserId(req);
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
    project.is_active = true;

    await project.save();

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
  const { project_id, task_number, task_description, task_status, task_feedback } = req.body;
  const { user_id } = getUserId(req);

  try {
    const project = await models.Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan',
        error_code: 404
      });
    }

    if (project.owner_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan membuat tugas untuk proyek ini',
        error_code: 403
      });
    }

    const newTask = await models.Project_Task.create({
      project_id,
      task_number,
      task_description,
      task_status,
      task_feedback
    });

    res.status(201).json({
      success: true,
      message: 'Tugas proyek berhasil dibuat',
      data: newTask,
      error_code: 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await models.Project.findAll({
      where: {
        is_active: true
      },
      include: [
        { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo'] },
        { model: models.Category, as: 'category', attributes: ['name'] },
        { model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] }
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
    const project = await models.Project.findByPk(id, {
      include: [
        { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo'] },
        { model: models.Category, as: 'category', attributes: ['name'] },
        { model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] },

      ]
    });

    const bids = await models.Project_User_Bid.findAll({
      where: { project_id: id },
      include: [
        { model: models.User, as: 'users_bid', attributes: ['full_name', 'username', 'profession', 'photo'] }
      ]
    });

    if (!project || !bids) {
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
    const { user_id } = getUserId(req);
    console.log('user id ', user_id)
    const projects = await models.Project.findAll({
      where: { owner_id: user_id },
      include: [
        { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'profession', 'photo'] },
        { model: models.Category, as: 'category', attributes: ['name'] },
        { model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] },
      ]
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
      data: {
        projects: formattedProjects,
        total_projects: projects.length,
      },
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
    const { user_id } = getUserId(req);
    const userProjectBids = await models.Project_User_Bid.findAll({
      where: { user_id: user_id },
      include: [{
        model: models.Project, as: 'project',
        include: [
          { model: models.User, as: 'owner_project', attributes: ['full_name', 'username', 'email', 'photo'] },
          { model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] },
        ],
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

    const formattedProjectBids = userProjectBids.map(bid => {
      return {
        ...bid.toJSON(),
        project: formatDates(bid.project.toJSON(), ['min_deadline', 'max_deadline'], 'd-MMM-yyyy'),
      };
    });

    const totalBids = await models.Project_User_Bid.count({
      where: { user_id }
    });

    return res.status(200).json({
      success: true,
      data: {
        users_bid: formattedProjectBids,
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
    const { user_id } = getUserId(req);
    const { freelancer_id } = req.body;

    const project = await models.Project.findOne({
      where: {
        id: id,
        owner_id: user_id,
        is_active: true
      }
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk memilih bidder untuk proyek ini",
        error_code: 403,
      });
    }

    const existingSelectedBid = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
        is_selected: true
      }
    });

    if (existingSelectedBid) {
      return res.status(400).json({
        success: false,
        message: "Bidder telah dipilih untuk proyek ini",
        error_code: 400,
      });
    }

    const existingUnselectedBid = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
        is_selected: false
      }
    });

    if (!existingUnselectedBid || existingUnselectedBid.user_id !== freelancer_id) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada bidder yang tersedia atau bidder tidak valid",
        error_code: 400,
      });
    }

    await models.Project_User_Bid.update(
      { is_selected: true },
      { where: { project_id: id, user_id: freelancer_id } }
    );

    await models.Project.update(
      { status_project: 'CLOSE' },
      { where: { id } }
    );

    const addTask = await models.Project_Task.update(
      { freelancer_id: freelancer_id },
      { where: { project_id: id } }
    )
    console.log(addTask)

    return res.status(200).json({
      success: true,
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

const deleteBidder = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = getUserId(req);
    const { bidder_id } = req.body;

    const project = await models.Project.findOne({
      where: {
        id: id,
        owner_id: user_id
      }
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk menghapus bidder dari proyek ini",
        error_code: 403,
      });
    }

    const existingBid = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
        user_id: bidder_id
      }
    });

    if (!existingBid) {
      return res.status(400).json({
        success: false,
        message: "Bidder tidak ditemukan atau tidak valid untuk proyek ini",
        error_code: 400,
      });
    }

    await existingBid.destroy();

    return res.status(200).json({
      success: true,
      message: "Bidder berhasil dihapus dari proyek",
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat menghapus bidder:", error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500,
    });
  }
};



const getUserSelectedProjectBids = async (req, res) => {
  try {
    const { user_id } = getUserId(req);
    const userSelectedProjectBids = await models.Project_User_Bid.findAll({
      where: {
        user_id:  user_id,
        is_selected: true
      },
      include: [{
        model: models.Project,
        as: 'project',
        include: [{ model: models.Project_Task, as: 'project_tasks', attributes: ['task_number', 'task_description', 'task_status'] }]
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

    if (min_budget) {
      if (!searchConditions.min_budget) searchConditions.min_budget = {};
      searchConditions.min_budget[Op.gte] = parseFloat(min_budget);
    }

    if (max_budget) {
      if (!searchConditions.max_budget) searchConditions.max_budget = {};
      searchConditions.max_budget[Op.lte] = parseFloat(max_budget);
    }

    const projects = await models.Project.findAll({
      where: { ...searchConditions, is_active: true },
      include: [
        {
          model: models.User,
          as: 'owner_project',
          attributes: ['full_name', 'username', 'email', 'photo']
        },
        {
          model: models.Category,
          as: 'category',
          attributes: ['name'],
          where: category ? { name: { [Op.like]: `%${category}%` } } : {},
        }
      ]
    });

    const dateFields = ['min_deadline', 'max_deadline', 'created_date'];

    const formattedProjects = projects.map(project => {
      return formatDates(project.toJSON(), dateFields, 'd-MMM-yyyy');
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
      data: {
        projects: formattedProjects,
        total_projects: projects.length
      },
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
    const { user_id } = getUserId(req);
    const { project_id, budget_bid } = req.body;
    const project = await models.Project.findByPk(project_id);

    if (!project || project.is_active === false) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan",
        error_code: 404,
      });
    }

    if (project.status_project !== 'OPEN') {
      return res.status(402).json({
        success: false,
        message: "Proyek tidak dalam status OPEN",
        error_code: 402,
      });
    }

    if (project.owner_id === user_id) {
      return res.status(403).json({
        success: false,
        message: "Anda adalah pemilik proyek ini",
        error_code: 403,
      });
    }

    const existingBid = await models.Project_User_Bid.findOne({
      where: {
        project_id,
        user_id
      }
    });

    if (existingBid) {
      return res.status(406).json({
        success: false,
        message: "Anda sudah membuat tawaran untuk proyek ini",
        error_code: 406,
      });
    }

    if (budget_bid < project.min_budget) {
      return res.status(400).json({
        success: false,
        message: "Budget bid tidak boleh lebih rendah dari minimum budget proyek",
        error_code: 400,
      });
    }

    if (budget_bid > project.max_budget) {
      return res.status(400).json({
        success: false,
        message: "Budget bid tidak boleh lebih tinggi dari maksimal budget proyek",
        error_code: 400,
      });
    }

    const projectBid = await models.Project_User_Bid.create({ ...req.body, user_id });

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
        { model: models.User, as: 'users_bid', attributes: ['id', 'full_name', 'username', 'profession', 'photo'] }
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

    const bidders = bids.map(bid => {
      const bidder = bid.users_bid.toJSON();
      bidder.is_selected = bid.is_selected;
      return bidder;
    }).filter(user => user !== null);

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
  deleteBidder,
  getProjectById,
  ownerSelectBidder,
  getAllProjects,
  postTask,
  getProjectList,
  getProjectBidders,
  getUserJobStatsAndBids,
  searchProjectsByTitle,
};
