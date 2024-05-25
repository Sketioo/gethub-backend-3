const models = require('../models');
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
        message: "Proyek tidak ditemukan",
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
    console.log(userSelectedProjectBids)

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

module.exports = {
  postProject,
  getOwnerProjects,
  getUserProjectBids,
  getUserSelectedProjectBids,
  postBid,
  getProjectById,
  ownerSelectBidder,
  getAllProjects
};
