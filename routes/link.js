const express = require("express");
const linkController = require("../controllers/link.controller");

const router = express.Router();

router.get("/links",  linkController.getLinks);
router.post("/link",  linkController.createLink);
router.get("/link/:id",  linkController.getLinkById);
router.put("/link/:id",  linkController.updateLink);
router.delete("/link/:id",  linkController.deleteLink);

module.exports = router;
