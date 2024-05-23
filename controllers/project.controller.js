const models = require('../models')

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
    return res.status(400).json({
      success: false,
      message: "Failed to post project",
      error_code: 400,
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
    const userIdLogin = getUserId(req); // Assuming you get the logged-in user's ID from authentication middleware
    const userProjectBids = await models.Project.findAll({
      include: [{
        model: models.Project_User_Bid,
        where: { user_id: userIdLogin }
      }]
    });
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

const getUserSelectedProjectBids = async (req, res) => {
  try {
    const userIdLogin = getUserId(req); // Assuming you get the logged-in user's ID from authentication middleware
    const userSelectedProjectBids = await models.Project.findAll({
      include: [{
        model: models.Project_User_Bid,
        where: { 
          user_id: userIdLogin,
          is_selected: true
        }
      }]
    });
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


module.exports = {
  postProject,
  getOwnerProjects,
  getUserProjectBids,
  getUserSelectedProjectBids
};
