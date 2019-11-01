var jwt = require("jsonwebtoken");
var env = process.env.NODE_ENV || "development";
var config = require("../config");
// config = require('../../../config');

/* With this method we generate a new token based on payload we want to put on it */
module.exports.issueToken = function(payload) {
  return jwt.sign(
    payload,
    config.env.development.secret,
    { expiresIn: "5d" } //expiry time for token set to 5 days
  );
};

/* Here we verify that the token we received on a request hasn't be tampered with. */

module.exports.verifyToken = function(token, verified) {
  return jwt.verify(
    token,
    config.env.development.secret || "its_an_amazing_ship_salman_built",
    {},
    verified
  );
};
