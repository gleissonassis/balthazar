
var connection = require('../config/mysql');
var Promise = require('promise');

function WordBO() {
  return {
    getWordsList: function() {
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM Word ORDER BY word', function(err, rows, fields) {
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
    },

    saveWord: function(word) {
      return new Promise(function(resolve, reject) {
        connection.query('INSERT INTO Word SET ?', {word: word.toLowerCase()}, function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve({
                word: word,
                id: result.insertId
              });
            }
          });
      });
    },

    saveWords: function(words) {
      var p = [];

      for(var i in words) {
        p.push(this.saveWord(words[i]));
      }

      return Promise.all(p);
    }
  };
}

module.exports = WordBO;
