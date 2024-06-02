
const express = require("express");
const userController = require("../controllers/analytic-screen.controller");

const { authenticateToken } = require("../middleware/check-auth");

const router = express.Router();



router.post("/post/card_viewers", authenticateToken, userController.createCardView);


module.exports = router;