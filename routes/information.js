// routes/information.js
const express = require('express');
const router = express.Router();

const informationController = require("../controllers/information.controller")

router.get('/informations', informationController.getAllInformation);
router.get('/information/:id', informationController.getInformationById);
router.post('/information', informationController.createInformation);
router.put('/information/:id', informationController.updateInformation);
router.delete('/information/:id', informationController.deleteInformation);

module.exports = router;
