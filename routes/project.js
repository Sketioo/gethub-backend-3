const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");
const { authenticateToken, verifyUserMiddleware } = require("../middleware/check-auth")

router.post("/projects", authenticateToken, verifyUserMiddleware, projectController.postProject);
router.post("/projects/bid", authenticateToken, verifyUserMiddleware, projectController.postBid);
router.post('/projects/select-bidder', authenticateToken, verifyUserMiddleware, projectController.ownerSelectBidder);
router.post('/projects/:id/tasks', authenticateToken, verifyUserMiddleware, projectController.postTask);
router.get("/projects", authenticateToken, projectController.getAllProjects);
router.get("/projects/:id", authenticateToken, projectController.getProjectById);
router.get("/projects/my", authenticateToken, projectController.getOwnerProjects);
router.get("/projects/my/selected-bids", authenticateToken, projectController.getUserSelectedProjectBids);
router.get("/projects/my/bids", authenticateToken, projectController.getUserProjectBids);

module.exports = router;
