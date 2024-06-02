
const express = require("express");
const viewerController = require("../controllers/viewers.controller");

const { authenticateToken } = require("../middleware/check-auth");

const router = express.Router();



router.post("/post/card_viewers", authenticateToken, viewerController.createCardView);


module.exports = router;