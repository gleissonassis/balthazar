var connection = require('../config/mysql');
var Promise = require('promise');

function SystemInfoDAO() {
  return {
    createSystemInfo: function(systemInfo) {
      return new Promise(function(resolve, reject) {
        connection.query('INSERT INTO SystemInfo SET ?', systemInfo, function(err, result) {
            if (err) {
              reject(err);
            } else {
              systemInfo.id = result.insertId;
              resolve(systemInfo);
            }
          });
      });
    },

    updateSystemInfo: function(systemInfo) {
      return new Promise(function(resolve, reject) {
        connection.query('UPDATE SystemInfo SET Key = ?, Name = ? WHERE Id = ?', [
          systemInfo.key,
          systemInfo.name,
          systemInfo.id
        ], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(systemInfo);
            }
          });
      });
    },

    getById: function(id) {
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM SystemInfo WHERE id = ?',
        [id],
        function(err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result ? result : null);
          }
        });
      });
    },
  };
}

module.exports = SystemInfoDAO;
