const express = require("express");
const paymentController = require("../payment/payment.controller");

const router = express.Router();

const { authenticateToken } = require("../middleware/check-auth")

router.post('/projects/:id/payments', authenticateToken, paymentController.processOwnerTransaction);
router.get('/projects/:id/settlements', authenticateToken, paymentController.getDetailSettlement);
// router.get('/user/certifications', authenticateToken, paymentController.getUserCertifications);
// router.get('/certification/:id', authenticateToken, paymentController.getCertificationById);
// router.put('/certification/:id', authenticateToken, paymentController.updateCertification);
// router.delete('/certification/:id', authenticateToken, paymentController.deleteCertification);

module.exports = router;
