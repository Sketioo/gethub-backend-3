// routes/information.js
const express = require('express');
const router = express.Router();

const informationController = require("../controllers/information.controller");
const { authenticateToken } = require("../middleware/check-auth");
const {validateInformation} = require("../middleware/input-validator")

router.get('/informations', authenticateToken, informationController.getAllInformation);
router.get('/information/:id', authenticateToken, informationController.getInformationById);
router.post('/information', validateInformation, authenticateToken, informationController.createInformation);
router.put('/information/:id', validateInformation, authenticateToken, informationController.updateInformation);
router.delete('/information/:id', authenticateToken, informationController.deleteInformation);

module.exports = router;
