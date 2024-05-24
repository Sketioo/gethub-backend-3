const models = require('../models');
const { getUserId } = require("../helpers/utility");

const postProject = async (req, res) => {
  try {
    const owner_id = getUserId(req);
    const checkOwner = await models.User.findByPk(owner_id);
    if (!checkOwner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
        error_code: 404,
      });
    }
    const project = await models.Project.create({ ...req.body, owner_id });
    return res.status(201).json({
      success: true,
      data: project,
      message: "Project posted successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error posting project:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to post project",
      error_code: 500,
    });
  }
};

const getAllProjects = async(req, res) => {
  try {
    const projects = await models.Project.findAll();
    if(!projects || projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No projects found",
        error_code: 404
      })
    }
    return res.status(200).json({
      success: true,
      data: projects,
      message: "Projects fetched successfully",
      error_code: 0
    })
  } catch (error) {
    console.error("Error getting all projects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all projects",
      error_code: 500,
    })
  }
}

const getProjectById= async (req, res) => {
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
        message: "Project not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: project,
      message: "Project details fetched successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project details",
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
      message: "Projects fetched successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error fetching owner's projects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner's projects",
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
        message: "User's project bids not found",
        error_code: 404,
      })
    }

    return res.status(200).json({
      success: true,
      data: userProjectBids,
      message: "User's project bids fetched successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error fetching user's project bids:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user's project bids",
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
        message: "Project bid not found",
        error_code: 404,
      });
    }

    projectBid.is_selected = true;

    await projectBid.save();

    return res.status(200).json({
      success: true,
      data: projectBid,
      message: "Freelancer selected successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error selecting freelancer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to select freelancer",
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
        message: "User's selected project bids not found",
        error_code: 404,
      })
    }
    return res.status(200).json({
      success: true,
      data: userSelectedProjectBids,
      message: "User's selected project bids fetched successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error fetching user's selected project bids:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user's selected project bids",
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
          message: "Failed to create project bid",
          error_code: 400,
        })
      }
      return res.status(200).json({
        success: true,
        data: projectBid,
        message: "Project bid created successfully",
        error_code: 0,
      })
    } else {
      return res.status(403).json({
        success: false,
        message: "You are the owner of this project",
        error_code: 403,
      })
    }
  } catch (error) {
    console.error("Error creating project bid:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create project bid",
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
