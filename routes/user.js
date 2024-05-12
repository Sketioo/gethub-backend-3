const express = require("express");
const userController = require("../controllers/user.controller");
const passport = require("passport");

const {
  validateRegisterUser,
  validateLoginUser,
} = require("../middleware/input-validator");
const { authenticateToken } = require("../middleware/check-auth");
const {verifyTokenEmail} = require("../helpers/email-verification")

const router = express.Router();

router.post("/register", validateRegisterUser, userController.register);
router.post("/login", validateLoginUser, userController.login);
router.post("/logout", userController.logout);

router.get("/public/profile", authenticateToken, userController.getPublicUser);

router.get("/complete-profiles", authenticateToken, userController.getAllProfiles);
router.get("/complete-profile/:id", authenticateToken, userController.getProfileById);
router.put("/complete-profile/:id", authenticateToken, userController.updateProfile);
router.delete("/complete-profile/:id", authenticateToken, userController.deleteProfile);

router.get("/verify/:token", verifyTokenEmail);

router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/auth/linkedin/redirect",
  passport.authenticate("linkedin", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

module.exports = router;
