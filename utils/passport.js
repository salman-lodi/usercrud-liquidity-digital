var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  user = require("../models/users").User,
  crypt = require("./crypt");
module.exports = function() {
  // Use local strategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      function(username, password, done) {
        var criteria = { email: username };
        user.findOne(criteria).then(
          function(user) {
            if (!user) {
              return done(null, false, {
                message: "Unknown user"
              });
            } else {
              crypt.hash(password, user.salt, function(err, hash) {
                if (err) return done(err);
                if (hash.toString("hex") === user.hash) return done(null, user);
                console.warn("AUTHENTICATION - INVALID PASSWORD", {
                  username: user.username
                });
                return done(null, false, {
                  message: "Invalid password"
                });
              });
            }
          },
          function(err) {
            return done(err);
          }
        );
      }
    )
  );
};
