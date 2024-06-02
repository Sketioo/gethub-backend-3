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
const { check } = require("express-validator");

// Routes for projects
router.post("/projects", authenticateToken, verifyUserMiddleware, checkProjectFraud, projectController.postProject);
router.post("/projects/bid", authenticateToken, verifyUserMiddleware, validateProjectUserBid, checkPortfolio, projectController.postBid);
router.post('/projects/:id/select-bidder', authenticateToken, verifyUserMiddleware, projectController.ownerSelectBidder);
router.delete('/projects/:id/delete-bidder', authenticateToken, verifyUserMiddleware, projectController.deleteBidder);
router.post('/projects/:id/tasks', authenticateToken, verifyUserMiddleware, validateProjectTask, projectController.postTask);
router.get('/projects/:id/tasks', authenticateToken, verifyUserMiddleware, projectController.getAllTask);
router.get("/projects", authenticateToken, projectController.getAllProjects);
router.get("/projects/my", authenticateToken, projectController.getOwnerProjects);
router.get("/projects/list", authenticateToken, projectController.getProjectList);
router.get("/projects/search", projectController.searchProjectsByTitle);
router.get("/projects/:id", authenticateToken, projectController.getProjectById);
router.get('/projects/dashboard/my', authenticateToken, projectController.getUserJobStatsAndBids);
//* Perhatikan penggunaan params
router.get("/projects/my/selected-bids", authenticateToken, projectController.getUserSelectedProjectBids);
router.get("/projects/my/bids", authenticateToken, projectController.getUserProjectBids);
router.get("/projects/:id/bidders", authenticateToken, projectController.getProjectBidders);


//* Routes for project reviews
router.get("/project-reviews", projectReviewController.getAllReview);
router.get("/project-reviews/:id", authenticateToken, projectReviewController.getReviewById);
router.post("/project-reviews", authenticateToken, verifyUserMiddleware, projectReviewController.createReview);

//*Admin

router.get('/admin/projects', authenticateToken, projectController.getAllProjectsAdmin)
router.put('/admin/projects/:id', authenticateToken, projectController.updateProjectActiveStatus)



module.exports = router;
