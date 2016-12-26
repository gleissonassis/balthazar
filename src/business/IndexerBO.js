
var connection = require('../config/mysql');
var StopWordBO = require('./StopWordBO');
var DocumentBO = require('./DocumentBO');
var SystemInfoBO = require('./SystemInfoBO');
var WordBO = require('./WordBO');
var Promise = require('promise');
var locks = require('locks');

var mutex = locks.createMutex();

function IndexerBO() {
  var wordBO = new WordBO();
  var stopWordBO = new StopWordBO();
  var documentBO = new DocumentBO();
  var systemInfoBO = new SystemInfoBO();

  return {
    parseDocument: function(document, stopWords) {
      var words = document
      .replace(/(?:\r\n|\r|\n)/g, ' ')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .toLowerCase()
      .split(' ');

      var list = [];
      var index = 0;

      for(var i in words) {
        var length = stopWords.filter(function(item) {
          return item.word && words[i] && item.word === words[i]
        }).length;

        if(length === 0 && words[i].trim().length > 0) {
          list.push({
            word: words[i],
            position: index
          });

          index++;
        }
      }

      return list;
    },

    clearIndexing: function(documentId) {
      return new Promise(function(resolve, reject) {
        connection.query('DELETE FROM `Index` WHERE documentId = ?', [documentId], function(err, result) {
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

      for(var i in index) {
        p.push(new Promise(function(resolve, reject) {
          connection.query('INSERT INTO `Index` SET ?', {
            wordId: index[i].wordId,
            position: index[i].position,
            documentId: index[i].documentId
          }, function(err, result) {
              if (err) {
                reject(err);
              } else {
                index[i].id = result.insertId;
                resolve(index[i]);
              }
            });
        }));
      }

      return Promise.all(p);
    },

    createIndexing: function(document, contents) {
      return new Promise((resolve, reject) => {
        var stopWords = [];
        var words = [];
        var index = [];
        var systemInfo = null;

        mutex.timedLock(1000,(error) => {
          if (error) {
            reject(new Error('Could not get the lock within 1 seconds, so gave up'));
          } else {
            var chain = Promise.resolve();

            chain
            .then(() => {
              return stopWordBO.getAll()
            })
            .then((result) => {
              stopWords = result;
              return wordBO.getWordsList();
            })
            .then((result) => {
              newWords = [];
              words = result;

              index = this.parseDocument(document.title + ' ' + contents, stopWords);

              var uniqueIndex = [];

              for(var i in index) {
                if(uniqueIndex.indexOf(index[i].word) === -1) {
                  uniqueIndex.push(index[i].word);
                }
              }

              for(var i in uniqueIndex) {
                var exists = words.filter((item) => {
                  return item.word === uniqueIndex[i];
                }).length;

                //if the word does not exist int the words list it will be
                //put in the newWords list in order to be saved
                if(exists === 0){
                  console.log(uniqueIndex[i]);
                  newWords.push(uniqueIndex[i]);
                }
              }

              return wordBO.saveWords(newWords);
            })
            .then((result) => {
              //at this point the code is not necessary to be synchronized, then
              //the mutex will be unlocked
              mutex.unlock();

              words = words.concat(result);

              return systemInfoBO.createSystemInfoById(document.systemInfoId);
            })
            .then((result) => {
              return documentBO.saveDocument(document);
            })
            .then((result) => {
              document.id = result.id;
              return this.clearIndexing(document.id);
            })
            .then(() => {
              //associating a word from the document to a word from the database
              //and its document
              for(var i in index) {
                if(index[i].word.trim().length > 0) {
                  var selectedWord = words.filter((item) => {
                    return item.word === index[i].word;
                  });

                  index[i].wordId = selectedWord[0].id;
                  index[i].documentId = document.id;
                }
              }

              return this.saveIndexing(index);
            })
            .then(resolve)
            .catch((error) => {
              mutex.unclock();
              reject(error);
            });
          }
        });

      });
    }
  };
}

module.exports = IndexerBO;
