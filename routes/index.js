var express = require('express');
var router = express.Router();
var routes = require('../services/routes');
var lists = require("../routes/list")
/* GET home page. */
for(let route of lists){
	router[route.method.toLowerCase()](route.path, function(req, res, next) {
		routes.connect(req, res, next, route.name, route.controller, route.action)
	})
}


module.exports = router;
