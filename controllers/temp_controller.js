ApplicationController = require('../controllers/application_controller')
var tokenService = require('../services/jwt_token_service');

class ApiController extends ApplicationController {
	constructor(req, res, next){
		super(req, res, next);
	}

	generateToken(){
		let testUserToken = {
			user:'salmanlodi',
			verified :true,
			description:'will delete this method after implementation of user auth module:)'
		}
		return this.res.send({
			status:true,
			msg:'this is temporary method to generate token',
			token:tokenService.issueToken(testUserToken) || "its_an_amazing_ship_i_built"
		})		
    }
    
}

module.exports = ApiController;
