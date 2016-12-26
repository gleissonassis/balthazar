var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'balthazar',
  password : 'balthazar2016',
  database : 'balthazar'
});

module.exports = connection;
