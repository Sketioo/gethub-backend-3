const express = require("express");
const router = express.Router();

const sponsorController = require("../controllers/sponsor.controller");

router.get("/sponsors", sponsorController.getAllSponsors);
router.get("/sponsor/:id", sponsorController.getSponsorById);
router.post("/sponsor", sponsorController.createSponsor);
router.put("/sponsor/:id", sponsorController.updateSponsor);
router.delete("/sponsor/:id", sponsorController.deleteSponsor);

module.exports = router;
