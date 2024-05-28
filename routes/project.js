const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");
const { authenticateToken, verifyUserMiddleware } = require("../middleware/check-auth");

// Routes for projects
router.post("/projects", authenticateToken, verifyUserMiddleware, projectController.postProject);
router.post("/projects/bid", authenticateToken, verifyUserMiddleware, projectController.postBid);
router.post('/projects/:id/select-bidder', authenticateToken, verifyUserMiddleware, projectController.ownerSelectBidder);
router.post('/projects/:id/tasks', authenticateToken, verifyUserMiddleware, projectController.postTask);
router.get("/projects", authenticateToken, projectController.getAllProjects);
router.get("/projects/my", authenticateToken, projectController.getOwnerProjects);
router.get("/projects/list", authenticateToken, projectController.getProjectList);
router.get("/projects/search", projectController.searchProjectsByTitle);
router.get('/projects/dashboard/my', authenticateToken, verifyUserMiddleware, projectController.getUserJobStatsAndBids);
//* Perhatikan penggunaan params
router.get("/projects/:id", authenticateToken, projectController.getProjectById);
router.get("/projects/my/selected-bids", authenticateToken, projectController.getUserSelectedProjectBids);
router.get("/projects/my/bids", authenticateToken, projectController.getUserProjectBids);
router.get("/projects/:id/bidders", authenticateToken, projectController.getProjectBidders);



// Routes for project owner review
router.post("/project-owner-reviews", authenticateToken, projectController.createProjectReview);
router.get("/project-owner-reviews/:id", authenticateToken, projectController.getProjectReviewById);
router.put("/project-owner-reviews/:id", authenticateToken, projectController.updateProjectReview);
router.delete("/project-owner-reviews/:id", authenticateToken, projectController.deleteProjectReview);

// Routes for freelancer review
router.post("/freelancer-reviews", authenticateToken, projectController.createFreelancerReview);
router.get("/freelancer-reviews/:id", authenticateToken, projectController.getProjectReviewFreelanceById);
router.put("/freelancer-reviews/:id", authenticateToken, projectController.updateProjectReviewFreelance);
router.delete("/freelancer-reviews/:id", authenticateToken, projectController.deleteProjectReviewFreelance);

module.exports = router;
