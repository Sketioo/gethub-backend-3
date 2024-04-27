const express = require("express");
const userController = require("../controllers/user.controller");
const passport = require('passport');

const router = express.Router();

router.get('/linkedin/authorize', userController.linkedinAuthorization);
router.get('/linkedin/redirect', userController.linkedinRedirect);

router.post("/signup", userController.signUp);
router.post("/login", userController.login);

router.get('/', function (req, res) {
  res.json({ message: 'Welcome to the backend app' });
});

// router.get('/profile', isLoggedIn, function (req, res) {
//   res.json({ user: req.user });
// });

router.get('/auth/linkedin', passport.authenticate('linkedin', {
  scope: ['email', 'profile'],
}));

router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

router.get('/logout', function (req, res) {
  req.logout();
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;

// router.post(
//   "/linkedin",
//   passport.authenticate("linkedin", { state: "LKSNDF" })
// );

// router.get(
//   "/linkedin/callback",
//   passport.authenticate("linkedin", { successRedirect: "auth/login/success" })
// );

// router.get('/login/success', (req,res) => {
//   res.json({message: "Login Successful", token: req.user.token})
// })
