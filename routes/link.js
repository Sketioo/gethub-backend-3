const express = require("express");

const linkController = require("../controllers/link.controller");
const { validateLink } = require("../middleware/input-validator");
const { authenticateToken } = require("../middleware/check-auth")

const router = express.Router();

router.get("/links", authenticateToken, linkController.getAllLinks);
router.get("/user/links", authenticateToken, linkController.getUserLinks);
router.post("/link", validateLink, authenticateToken, linkController.createLink);
router.get("/link/:id", authenticateToken, linkController.getLinkById);
router.put("/link/:id", validateLink, authenticateToken, linkController.updateLink);
router.delete("/link/:id", authenticateToken, linkController.deleteLink);

//* Admin
router.get("/admin/links", authenticateToken, linkController.getAllLinks);



module.exports = router;
