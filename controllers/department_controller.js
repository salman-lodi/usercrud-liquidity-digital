ApplicationController = require("../controllers/application_controller");
var tokevnService = require("../services/jwt_token_service");
var Department = require("../models/department").Department;

class DepartmentController extends ApplicationController {
  constructor(req, res, next) {
    super(req, res, next);
  }

  create() {
    var self = this;
    if (!self.req.body.name) {
      return self.res.status(400).send({
        status: false,
        message: "required parameters missing",
        result: {}
      });
    }
    let data = {
      name: self.req.body.name
    };

    var department = new Department(data);
    department.save(function(err, dept) {
      if (err)
        return self.res.send({
          status: false,
          result: {},
          message: "Duplicate entry. Please try again"
        });
      self.res.send(dept);
    });
  }

  get() {
    Department.find().then(result => {
      return this.res.json({ status: true, result: result });
    });
  }
}

module.exports = DepartmentController;
