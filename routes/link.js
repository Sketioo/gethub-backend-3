const express = require("express");

const linkController = require("../controllers/link.controller");
const { validateLink } = require("../middleware/input-validator");

const router = express.Router();

router.get("/links", linkController.getLinks);
router.post("/link", validateLink, linkController.createLink);
router.get("/link/:id", linkController.getLinkById);
router.put("/link/:id", validateLink, linkController.updateLink);
router.delete("/link/:id", linkController.deleteLink);

module.exports = router;
