const express = require("express");
const enumeController = require("../controllers/enumeration.controller");

const router = express.Router();

const { authenticateToken } = require("../middleware/check-auth")

router.post('/enumeration', authenticateToken, enumeController.createEnumeration);
router.get('/enumerations', authenticateToken, enumeController.getAllEnumerations);
router.get('/enumeration/:id', authenticateToken, enumeController.getEnumerationById);
router.put('/enumeration/:id', authenticateToken, enumeController.updateEnumeration);
router.delete('/enumeration/:id', authenticateToken, enumeController.deleteEnumeration);
router.get('/enumeration/', authenticateToken, enumeController.getEnumerationsByCriteria);

module.exports = router;
