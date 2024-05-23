const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project.controller");
const { authenticateToken } = require("../middleware/check-auth")

router.post("/posting", authenticateToken, projectController.postProject);
router.get("/posting/my", authenticateToken, projectController.getOwnerProjects);
router.get("/bids", authenticateToken, projectController.getUserProjectBids);
router.get("/bids_selected", authenticateToken, projectController.getUserSelectedProjectBids);
// router.delete("/sponsor/:id", authenticateToken, sponsorController.deleteSponsor);

module.exports = router;
