const dotenv = require("dotenv").config();

const passport = require("passport");
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


const passportConfig = {
  linkedinAuth: {
    clientID: process.env["CLIENT_ID"],
    clientSecret: process.env["CLIENT_SECRET"],
    callbackURL: "http://127.0.0.1:3000/api/auth/linkedin/callback",
  },
};

passport.use(
  new LinkedInStrategy(
    {
      clientID: passportConfig.linkedinAuth.clientID,
      clientSecret: passportConfig.linkedinAuth.clientSecret,
      callbackURL: passportConfig.linkedinAuth.callbackURL,
      scope: ["email", "profile"],
    },
    function (token, tokenSecret, profile, done) {
      return done(null, profile);
    }
  )
);

module.exports = {
  passportConfig,
  passportStrategy: passport
}