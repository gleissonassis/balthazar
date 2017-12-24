var connection    = require('../config/mysql');
var Promise       = require('promise');

function SystemInfoDAO() {
  return {
    getAll: function(id) {
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM SystemInfo ORDER BY name',
        [id],
        function(err, result) {
          if (err) {
            reject(connection.parseError(err));
          } else {
            resolve(result);
          }
        });
      });
    },

    createSystemInfo: function(systemInfo) {
      return new Promise(function(resolve, reject) {
        connection.query('INSERT INTO SystemInfo SET ?', systemInfo, function(err) {
            if (err) {
              reject(connection.parseError(err));
            } else {
              resolve(systemInfo);
            }
          });
      });
    },

    updateSystemInfo: function(systemInfo) {
      return new Promise(function(resolve, reject) {
        connection.query('UPDATE SystemInfo SET name = ? WHERE id = ?', [
          systemInfo.name,
          systemInfo.id
        ], function(err) {
            if (err) {
              reject(connection.parseError(err));
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
            reject(connection.parseError(err));
          } else {
            resolve(result ? result[0] : null);
          }
        });
      });
    },

    deleteById: function(id) {
      return new Promise(function(resolve, reject) {
        connection.query('DELETE FROM `SystemInfo` WHERE id = ?', [id], function(err) {
            if (err) {
              reject(connection.parseError(err));
            } else {
              resolve();
            }
          });
      });
    },
  };
}

module.exports = SystemInfoDAO;
