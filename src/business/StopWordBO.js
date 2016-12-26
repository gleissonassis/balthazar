
var connection = require('../config/mysql');
var Promise = require('promise');

function StopWordBO() {
  return {
    getAll: function() {
      return new Promise(function(resolve, reject) {

        connection.query('SELECT * FROM StopWord ORDER BY Word', function(err, rows, fields) {
            if (err) {
              reject(err);
            } else {
              var list = [];

              for (var i in rows) {
                list.push(rows[i]);
              }

              resolve(list);
            }
        });
      });
    }
  };
}

module.exports = StopWordBO;
