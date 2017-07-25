const passport = require('passport');
const User = require('../models/user');
const { SECRET } = require('../../shared/config')

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  // Verify username & password
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { error: 'Unable to find that user' })
    }
    user.comparePassword(password, function (compareErr, isMatch) {
      if (compareErr) {
        return done(compareErr)
      }
      if (!isMatch) {
        return done(null, false, { error: 'Invalid username/password' });
      }
      return done(null, user);
    })
  })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  User.findById(payload.sub, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    }
    else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);