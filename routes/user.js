const express = require("express");
const userController = require("../controllers/user.controller");
const passport = require("passport");

const router = express.Router();


router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

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
