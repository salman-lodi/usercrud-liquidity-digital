let constants = require("./constants");
/**
 * Find max of a 2D array by column.
 * A dict needs to be passed to this function, of the form
 * dict = {
 *          'key1': [[..],[..],...],
 *          'key2': [[..],[..],...],
 *          ...
 * }
 *
 * @param {String} 'max' or 'min'.
 * @param {Object} dictionary of arrays to be sorted.
 * @param {Number} column in array based on which max/min needs to be calculated.
 * @param {Function} callback.
 * @api public
 */

/**
 * Validates signup form.
 *
 * @param {Object} JSON object of request body.
 * @param {Function} callback.
 * @api public
 */
var getMaxOrMinofArray = function(maxormin, array_dict, column, fn) {
  var array = Object.keys(array_dict).map(function(key) {
    return array_dict[key];
  });
  var max = array.reduce(function(previousVal, currentItem, array, arr) {
    if (maxormin == "max") {
      return Math.max(previousVal, currentItem[column]);
    } else {
      return Math.min(previousVal, currentItem[column]);
    }
  }, Number.NEGATIVE_INFINITY);

  fn(
    null,
    array.filter(function(i) {
      return null, i[1] == max;
    })
  );
};

var validateSignUpForm = function(request_body, fn) {
  var username = request_body.username;
  var password = request_body.password;
  var role = request_body.role;

  if (username && password && role) {
    return fn(null, true);
  } else {
    return fn(constants.ERR_SIGNUP_DATA_MISSING, false);
  }
};

module.exports = {
  getMaxOrMinofArray: getMaxOrMinofArray,
  validateSignUpForm: validateSignUpForm
};
