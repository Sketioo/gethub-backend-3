
const express = require("express");
const viewerController = require("../controllers/viewers.controller");

const { authenticateToken } = require("../middleware/check-auth");

const router = express.Router();



router.post("/post/card_viewers", authenticateToken, viewerController.createCardView);
router.post("/post/web_viewers", viewerController.createWebView);

router.get("/analitic/total", authenticateToken, viewerController.getTotalAnalytics)

// untuk data dilihat oleh user
router.get("/card_viewers", authenticateToken, viewerController.getCardViewers);

router.get("/graph_data",authenticateToken, viewerController.getGraphData);

module.exports = router;