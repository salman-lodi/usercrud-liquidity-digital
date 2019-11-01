module.exports = {
  connect: function(req, res, next, name, controller, action) {
    var ControllerClass = require("../controllers/" +
      controller +
      "_controller");
    var controller = new ControllerClass(req, res, next);
    //  controller["validate"]().then((response) => {
    try {
      controller[action](next);
    } catch (err) {
      next(err);
    }
    // }).catch((err) => {
    // 	console.log(err);
    // 	res.status(err.status).json(err.message);
    // })
  }
};
