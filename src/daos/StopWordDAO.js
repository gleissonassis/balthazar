var connection = require('../config/mysql');
var Promise = require('promise');

function StopWordDAO() {
  return {
    getAll: function(language) {
      return new Promise(function(resolve, reject) {

        connection.query('SELECT * FROM StopWord WHERE language = ? ORDER BY word',
        [language],
        function(err, rows) {
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

module.exports = StopWordDAO;
