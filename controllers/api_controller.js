ApplicationController = require("../controllers/application_controller");
const BankBranch = require("../models/users");
var tokenService = require("../services/jwt_token_service");
var User = require("../models/users").User;
var AuthController = require("./user_auth_controller");
const _ = require("lodash");
const constants = require("../utils/constants");
class ApiController extends ApplicationController {
  constructor(req, res, next) {
    super(req, res, next);
    // this.validate();
  }

  validate() {
    var self = this;
    var token;
    if (self.req.headers && self.req.headers.authorization) {
      var parts = self.req.headers.authorization.split(" ");

      if (parts.length == 2) {
        var scheme = parts[0],
          credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        return self.res.status(401).json({
          message: "Format is Authorization: Bearer [token]"
        });
      }
    } else if (self.req.params.token) {
      token = self.req.params.token;

      // We delete the token from query and body to not mess with blueprints
      delete self.req.query.token;
      delete self.req.body.token;
    } else {
      return self.res.status(401).json({
        message: "No Authorization header was found"
      });
    }

    tokenService.verifyToken(token, function(error, token) {
      if (error) {
        return self.res.status(401).json({
          message: "Invalid token/User is not logged in"
        });
      } else {
        self.req.user = token;
      }
    });
  }

  hello(next) {
    this.res.json({ message: "Welcome to user crud" });
  }

  signup() {
    AuthController.signup(this.req, this.res, this.next);
  }

  signin() {
    AuthController.signin(this.req, this.res, this.next);
  }

  getUsers() {
    User.find().then(result => {
      return this.res.json({ status: true, result: result });
    });
  }

  getUserById() {
    User.findOne({ _id: this.req.params._id })
      .select("-salt -hash -__v -password -createdAt -updatedAt")
      .then(result => {
        return this.res.json({ status: true, result: result });
      });
  }

  deleteUserById() {
    User.findByIdAndRemove({ _id: this.req.params._id }).then(result => {
      return this.res.json({ status: true, result: result });
    });
  }

  updateUserById() {
    let query = {
      _id: this.req.params._id
    };
    let update = _.pick(this.req.body, ["firstName", "lastName", "department"]);
    User.findOneAndUpdate(query, update, { new: true })
      .select("-__v -password -createdAt -updatedAt")
      .then(result => {
        if (result) {
          return this.res.json({ status: true, result: result });
        } else {
          return this.res.json({
            status: false,
            message: constants.RESOURCE_NOT_FOUND,
            result: {}
          });
        }
      });
  }
}

module.exports = ApiController;
