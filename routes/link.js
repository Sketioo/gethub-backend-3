const express = require("express");
const linkController = require("../controllers/link.controller");

const {isLoggedIn} = require("../middleware/check-auth");
const router = express.Router();

router.get("/links",  linkController.getLinks);
router.post("/links",  linkController.createLink);
router.get("/links/:id",  linkController.getLinkById);
router.put("/links/:id",  linkController.updateLink);
router.delete("/links/:id",  linkController.deleteLink);

module.exports = router;
