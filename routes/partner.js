const express = require("express");
const router = express.Router();

const partnerController = require("../controllers/partner.controller");
const { authenticateToken } = require("../middleware/check-auth")
const { validatePartner } = require("../middleware/input-validator")

router.get("/partners", authenticateToken, partnerController.getAllPartners);
router.get("/user/partners", authenticateToken, partnerController.getUserPartners);
router.get("/partner/search", authenticateToken, partnerController.searchForPartner);
router.get("/partner/:id", authenticateToken, partnerController.getPartnerById);
router.post("/partner", authenticateToken, validatePartner, partnerController.addPartner);
router.post("/partner-qr", authenticateToken, validatePartner, partnerController.addPartnerByQR);
router.put("/partner/:id", authenticateToken, partnerController.updatePartner);
router.delete("/partner/:id", authenticateToken, partnerController.deletePartner);
router.get("/new_partner", authenticateToken, partnerController.getPartnerNew);

module.exports = router;
