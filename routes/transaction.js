const express = require("express");
const paymentController = require("../payment/payment.controller");

const router = express.Router();

const { authenticateToken } = require("../middleware/check-auth")

router.post('/projects/:id/payments', authenticateToken, paymentController.processOwnerTransaction);
router.post('/user/premium', authenticateToken, paymentController.processPremiumPayment)
router.get('/projects/:id/payments', authenticateToken, paymentController.getDetailPayment);
router.get('/projects/:id/settlements', authenticateToken, paymentController.getSettlementByProjectId);
router.post('/projects/:id/settlements', authenticateToken, paymentController.createSettlement);
router.get('/payments/banks', authenticateToken, paymentController.getBanks);
router.post('/user/verify-status-payment/:id', authenticateToken, paymentController.verifyTransactionStatus);
router.get('/user/invoice-payments', authenticateToken, paymentController.getInvoicePayment);


//* ADMIN
router.get('/admin/projects/settlements', authenticateToken, paymentController.getAllSettlements);
router.put('/admin/projects/:projectId/settlements/:settlementId', authenticateToken, paymentController.updateSettlement)


module.exports = router;
