const express = require("express");
const router = express.Router();

const partnerController = require("../controllers/partner.controller");

router.get("/partners", partnerController.getAllPartners);
router.get("/partner/:id", partnerController.getPartnerById);
router.post("/partner", partnerController.createPartner);
router.put("/partner/:id", partnerController.updatePartner);
router.delete("/partner/:id", partnerController.deletePartner);


module.exports = router;
