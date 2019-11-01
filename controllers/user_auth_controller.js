var _ = require("lodash"),
  passport = require("passport"),
  tokenService = require("../services/jwt_token_service"),
  User = require("../models/users").User,
  misc = require("../utils/misc"),
  constants = require("../utils/constants"),
  crypt = require("../utils/crypt");

exports.signup = function(req, res, next) {
  if (req.body.email && req.body.email.length) userExist(req, res, next);
  else
    res.status(400).send({
      msg: constants.ERR_SIGNUP_DATA_MISSING,
      status: false
    });
};

function signupprocess(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  misc.validateSignUpForm(req.body, function(err, valid) {
    if (err) {
      next(err);
    } else {
      crypt.hash(password, function(err, salt, hash) {
        if (err) next(err);
        var user = new User({
          email: email,
          salt: salt,
          hash: hash,
          firstName: req.body.firstName || "",
          lastName: req.body.lastName || "",
          phone: req.body.phone || "",
          department: req.body.department || ""
        });
        user.save(function(err, new_user) {
          if (err) next(err);
          console.info(
            "SIGNUP - USER SAVED IN DB. PROCEEDING TO GENERATE ACTIVATE KEY NOW.",
            {
              username: new_user.email
            }
          );
          new_user.salt = undefined;
          new_user.hash = undefined;
          res.status(200).send({
            status: true,
            user: new_user,
            msg: constants.SUCCESS
          });
        });
      });
    }
  });
}

// User Signin
exports.signin = function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err || !user) {
      res.status(400).json(info);
    } else {
      // Remove sensitive data before login
      user.hash = undefined;
      user.salt = undefined;
      User.findById(user._id).then(userOne => {
        let tempUser = user.toObject();
        res.jsonp({
          user: tempUser,
          token: tokenService.issueToken(tempUser)
        });
      });
    }
  })(req, res, next);
};

//Signout
exports.signout = function(req, res) {
  req.logout();
  res.status(200).json({
    message: "Logout successfully"
  });
};

/**
 * Checks if username exists in the database.
 * If yes, move to signupprocess.
 * If no, redirect user to signup page.
 * (Called during signup process.)
 *
 * @param {String} request.
 * @param {String} response.
 */
function userExist(req, res, next) {
  User.count(
    {
      username: req.body.email.toLowerCase()
    },
    function(err, count) {
      if (err) next(err);
      if (count === 0) {
        return signupprocess(req, res, next);
      } else {
        console.warn("SIGNUP - USERNAME ALREADY EXISTS", {
          username: req.body.username
        });
        return res.status(200).send({
          status: false,
          msg: constants.RESOURCE_ALREADY_PRESENT
        });
      }
    }
  );
}
