const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");
const projectReviewController = require("../controllers/project-review.controller");
const { authenticateToken, verifyUserMiddleware, checkPortfolio } = require("../middleware/check-auth");
const { checkProjectFraud } = require("../middleware/ml-services");
const {
  validateProject, validateProjectReview, validateProjectReviewFreelance,
  validateProjectUserBid, validateProjectTask
} = require("../middleware/input-validator");

// Routes for projects
router.post("/projects", authenticateToken, verifyUserMiddleware, checkProjectFraud, projectController.postProject);
// router.post("/projects/bid", authenticateToken, verifyUserMiddleware, validateProjectUserBid, checkPortfolio, projectController.postBid);
router.post("/projects/bid", authenticateToken, verifyUserMiddleware, validateProjectUserBid, projectController.postBid);
router.post('/projects/:id/select-bidder', authenticateToken, verifyUserMiddleware, projectController.ownerSelectBidder);
router.post('/projects/:id/tasks', authenticateToken, verifyUserMiddleware, validateProjectTask, projectController.postTask);
router.get("/projects", authenticateToken, projectController.getAllProjects);
router.get("/projects/my", authenticateToken, projectController.getOwnerProjects);
router.get("/projects/list", authenticateToken, projectController.getProjectList);
router.get("/projects/search", projectController.searchProjectsByTitle);
router.get("/projects/:id", authenticateToken, projectController.getProjectById);
router.get('/projects/dashboard/my', authenticateToken, verifyUserMiddleware, projectController.getUserJobStatsAndBids);
//* Perhatikan penggunaan params
router.get("/projects/my/selected-bids", authenticateToken, projectController.getUserSelectedProjectBids);
router.get("/projects/my/bids", authenticateToken, projectController.getUserProjectBids);
router.get("/projects/:id/bidders", authenticateToken, projectController.getProjectBidders);

// // Routes for project owner review
// router.post("/project-owner-reviews", authenticateToken, validateProjectReview, projectReviewController.createProjectReview);
// router.get("/project-owner-reviews/:id", authenticateToken, projectReviewController.getProjectReviewById);
// router.put("/project-owner-reviews/:id", authenticateToken, validateProjectReview, projectReviewController.updateProjectReview);
// router.delete("/project-owner-reviews/:id", authenticateToken, projectReviewController.deleteProjectReview);

// // Routes for freelancer review
// router.post("/freelancer-reviews", authenticateToken, validateProjectReviewFreelance, projectReviewController.createFreelancerReview);
// router.get("/freelancer-reviews/:id", authenticateToken, projectReviewController.getProjectReviewFreelanceById);
// router.put("/freelancer-reviews/:id", authenticateToken, validateProjectReviewFreelance, projectReviewController.updateProjectReviewFreelance);
// router.delete("/freelancer-reviews/:id", authenticateToken, projectReviewController.deleteProjectReviewFreelance);


module.exports = router;
