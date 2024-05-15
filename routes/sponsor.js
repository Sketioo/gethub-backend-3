const express = require("express");
const router = express.Router();

const sponsorController = require("../controllers/sponsor.controller");
const { authenticateToken } = require("../middleware/check-auth")
const { validateSponsor } = require("../middleware/input-validator")

router.get("/sponsors", authenticateToken, sponsorController.getAllSponsors);
router.get("/sponsor/:id", authenticateToken, sponsorController.getSponsorById);
router.post("/sponsor", authenticateToken, validateSponsor, sponsorController.createSponsor);
router.put("/sponsor/:id", authenticateToken, validateSponsor, sponsorController.updateSponsor);
router.delete("/sponsor/:id", authenticateToken, sponsorController.deleteSponsor);

module.exports = router;
