var mysql = require('mysql');
var settings    = require('./settings');

var connection = mysql.createConnection(settings.mysql);

connection.parseError = function(e) {
  switch (e.errno) {
    case 1062:
      return {
        status: 409,
        code: e.code,
        message: 'There is a object using the provided identifier'
      };
    case 1451:
      return {
        status: 409,
        code: e.code,
        message: 'The object is in use and can not be deleted'
      };
    case 1364:
      return {
        status: 422,
        code: e.code,
        message: e.sqlMessage
      };
    case 1292:
      return {
        status: 422,
        code: e.code,
        message: e.sqlMessage
      };
    default:
      e.status = 500;
      return e;
  }
};

module.exports = connection;
