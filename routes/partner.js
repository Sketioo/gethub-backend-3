const express = require("express");
const router = express.Router();

const partnerController = require("../controllers/partner.controller");
const { authenticateToken } = require("../middleware/check-auth")

router.get("/partners", authenticateToken, partnerController.getAllPartners);
router.get("/partner/:id", authenticateToken, partnerController.getPartnerById);
router.post("/partner", authenticateToken, partnerController.createPartner);
router.put("/partner/:id", authenticateToken, partnerController.updatePartner);
router.delete("/partner/:id", authenticateToken, partnerController.deletePartner);


module.exports = router;
