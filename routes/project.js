const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");
const { authenticateToken, verifyUserMiddleware } = require("../middleware/check-auth")

router.post("/posting", authenticateToken, verifyUserMiddleware, projectController.postProject);
router.post("/bid", authenticateToken, verifyUserMiddleware, projectController.postBid);
router.post('/select-bidder/', authenticateToken, verifyUserMiddleware, projectController.ownerSelectBidder)
router.get("/posts", authenticateToken, projectController.getAllProjects);
router.get("/:id", authenticateToken, projectController.getProjectById);
router.get("/my/posting", authenticateToken, projectController.getOwnerProjects);
router.get("/my/bids", authenticateToken, projectController.getUserProjectBids);
router.get("/my/bids_selected", authenticateToken, projectController.getUserSelectedProjectBids);
// router.delete("/sponsor/:id", authenticateToken, sponsorController.deleteSponsor);

module.exports = router;
