const express = require("express");
const certificateController = require("../controllers/certification.controller");

const router = express.Router();

const { authenticateToken } = require("../middleware/check-auth")

router.post('/certification', authenticateToken, certificateController.createCertification);
router.get('/certifications', authenticateToken, certificateController.getAllCertifications);
router.get('/certification/:id', authenticateToken, certificateController.getCertificationById);
router.put('/certification/:id', authenticateToken, certificateController.updateCertification);
router.delete('/certification/:id', authenticateToken, certificateController.deleteCertification);

module.exports = router;
