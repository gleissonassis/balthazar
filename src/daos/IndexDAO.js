
var connection      = require('../config/mysql');
var Promise         = require('promise');


function IndexerDAO() {
  return {
    clearIndexing: function(documentId) {
      return new Promise(function(resolve, reject) {
        connection.query('DELETE FROM `Index` WHERE documentId = ?', [documentId], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
      });
    },

    saveIndexing: function(index) {
      var p = [];

      index.forEach(function(element) {
        p.push(new Promise(function(resolve, reject) {
          connection.query('INSERT INTO `Index` SET ?', element, function(err, result) {
              if (err) {
                reject(err);
              } else {
                element.id = result.insertId;
                resolve(element);
              }
            });
        }));
      });

      return Promise.all(p);
    }
  };
}

module.exports = IndexerDAO;
