const express = require("express");
const userController = require("../controllers/user.controller");
const passport = require("passport");

const {
  validateRegisterUser,
  validateLoginUser,
} = require("../middleware/input-validator");
const { authenticateToken } = require("../middleware/check-auth");

const router = express.Router();

router.post("/register", validateRegisterUser, userController.register);
router.post("/login", validateLoginUser, userController.login);
router.post("/logout", userController.logout);

router.get("/public/profile", userController.getPublicUser);
// router.get("/public/profile/:username", userController.getPublicUser);

router.get(
  "/complete-profiles",
  authenticateToken,
  userController.getAllProfiles
);
router.get("/complete-profile/:id", userController.getProfileById);
router.put("/complete-profile/:id", userController.updateProfile);
router.delete("/complete-profile/:id", userController.deleteProfile);

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
