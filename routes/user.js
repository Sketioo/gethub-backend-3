const express = require("express");
const userController = require("../controllers/user.controller");
const passport = require("passport");

const router = express.Router();


router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.get("/profiles", userController.getAllProfiles);
router.get("/profile/:id", userController.getProfileById);
router.put("/profile/:id/update", userController.updateProfile);
router.delete("/profile/:id/delete", userController.deleteProfile);


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

// router.get('/profile', isLoggedIn, function (req, res) {
//   res.json({ user: req.user });
// });

// router.get("/logout", function (req, res) {
//   req.logout();
//   res.json({ message: "Logged out successfully" });
// });
