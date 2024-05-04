const express = require("express");
const enumeController = require("../controllers/enumeration.controller");

const router = express.Router();


router.post('/enumeration', enumeController.createEnumeration);
router.get('/enumerations', enumeController.getAllEnumerations);
router.get('/enumeration/:id', enumeController.getEnumerationById);
router.put('/enumeration/:id', enumeController.updateEnumeration);
router.delete('/enumeration/:id', enumeController.deleteEnumeration);

module.exports = router;
