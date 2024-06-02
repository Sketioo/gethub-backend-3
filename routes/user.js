const express = require("express");
const userController = require("../controllers/user.controller");

const {
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
} = require("../middleware/input-validator");
const { authenticateToken } = require("../middleware/check-auth");
const { isPremium } = require("../middleware/is-premium");
const { verifyTokenEmail, regenerateVerificationToken } = require("../helpers/email-verification")

const router = express.Router();

router.post("/register", validateRegisterUser, userController.register);
router.post("/login", validateLoginUser, userController.login);

router.get("/public/profile", userController.getPublicUser);

router.get("/profiles", authenticateToken, userController.getAllProfiles);
router.get("/profile", authenticateToken, userController.getProfileById);
router.put("/profile", authenticateToken, validateUpdateUser, userController.updateProfile);
router.delete("/profile", authenticateToken, userController.deleteProfile);

router.get("/verify/:token", verifyTokenEmail);
router.get("/regenerate-verification", authenticateToken, regenerateVerificationToken);

router.post("/update/visibility", authenticateToken, userController.updateVisibility);
router.post("/update/theme_hub", authenticateToken, userController.updateThemeHub);

//* Admin

router.get('/admin/users', authenticateToken, userController.getAllUsersAdmin);
router.put('/admin/users/:id', authenticateToken, userController.updateUserVerificationStatus)


router.post('/role', authenticateToken, userController.createRole)
router.get('/roles', authenticateToken, userController.getAllRoles)


module.exports = router;