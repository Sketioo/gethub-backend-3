const express = require("express");
const paymentController = require("../payment/payment.controller");

const router = express.Router();

const { authenticateToken } = require("../middleware/check-auth")

router.post('/projects/:id/payments', authenticateToken, paymentController.processOwnerTransaction);
router.post('/user/premium', authenticateToken, paymentController.processPremiumPayment)
router.get('/projects/:id/payments', authenticateToken, paymentController.getDetailPayment);
router.post('/api/projects/:id/settlements', authenticateToken, paymentController.createSettlement);
router.get('/payments/banks', authenticateToken, paymentController.getBanks)


//* ADMIN
router.get('/api/admin/projects/settlements', authenticateToken, paymentController.getAllSettlements);
router.put('/api/admin/projects/:projectId/settlements/:settlementId', authenticateToken, paymentController.updateSettlement)


module.exports = router;
