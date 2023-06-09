const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const passport = require("passport");
const ShelterUser = require("../models/animalshelter");
const petowner = require("../models/owner");

const JWT_SECRET = "your-secret-key";

// Local strategy for username/password authentication
const shelterlocal = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      // Find the user with the given email
      const user = await ShelterUser.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// JWT strategy for token authentication
const shelterjwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    try {
      // Find the user with the given ID
      const user = await ShelterUser.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

const petownerlocal = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      // Find the user with the given email
      const user = await petowner.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

const petownerjwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    try {
      // Find the user with the given ID
      const user = await petowner.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

module.exports = function (passport) {
  passport.use("shelterlocal", shelterlocal);
  passport.use("petownerlocal", petownerlocal);
  passport.use("shelterjwtStrategy", shelterjwtStrategy);
  passport.use("petownerjwtStrategy", petownerjwtStrategy);
};
