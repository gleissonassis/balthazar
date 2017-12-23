
var connection    = require('../config/mysql');
var logger        = require('../config/logger');
var Promise       = require('promise');

function WordDAO() {
  return {
    getDictionary: function(systemInfoId, language) {
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM Word WHERE systemInfoId = ? AND language = ? ORDER BY word',
        [systemInfoId, language],
        function(err, rows) {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
        });
      });
    },

    saveWord: function(word) {
      return new Promise(function(resolve, reject) {

        logger.info('Saving a new word', word);

        connection.query('INSERT INTO Word SET ?', word, function(err, result) {
            if (err) {
              logger.error('An error has occurred while saving a new word', err);
              reject(err);
            } else {
              word.id = result.insertId;

              logger.info('The word as been saved successfully', word);
              resolve(word);
            }
          });
      });
    }
  };
}

module.exports = WordDAO;
