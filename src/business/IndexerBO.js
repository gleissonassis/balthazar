var Promise         = require('promise');
var locks           = require('locks');
var logger          = require('../config/logger');
var crypto          = require('crypto');

var mutex = locks.createMutex();

function IndexerBO(dependencies) {
  var dao = dependencies.dao;
  var wordBO = dependencies.wordBO;
  var documentBO = dependencies.documentBO;
  var stopWordBO = dependencies.stopWordBO;
  var systemInfoBO = dependencies.systemInfoBO;

  return {
    parseDocument: function(document, stopWords) {
      var words = document
      .replace(/(?:\r\n|\r|\n)/g, ' ')
      .replace(/['.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .toLowerCase()
      .split(' ');

      var list = [];
      var index = 0;

      for (var i in words) {
        var length = stopWords.filter(function(item) {
          return item.word === words[i];
        }).length;

        if (length === 0 && words[i].trim().length > 0) {
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
      return dao.clearIndexing(documentId);
    },

    saveIndexing: function(index) {
      return dao.saveIndexing(index);
    },

    buildIndex: function(document) {
      var self = this;

      return new Promise(function(resolve, reject){
        var stopWords = [];
        var dictionary = [];
        var index = [];
        var isLocked = false;

        try {
          logger.info('Checking if the system exists', document.systemInfoId);
          systemInfoBO.getById(document.systemInfoId)
            .then(function(r){
              if (r) {
                logger.info('The system exists', r);
                return r;
              } else {
                return Promise.reject({
                  status: 404,
                  message: 'System not found'
                });
              }
            })
            .then(function() {
              logger.info('Computing the hash for the document', document);
              //calculating the hash for this document in order to prevent
              //build a index for a document that already exists in the database
              var data = document.title + ' ' + document.contents;
              document.hash = crypto.createHash('md5').update(data).digest('hex');
              logger.info(document.hash);

              documentBO.getByHash(document.systemInfoId,
                document.group,
                document.reference,
                document.hash)
                .then(function(d) {
                  if (d) {
                    resolve({
                      document: d,
                      index: []
                    });
                    logger.info('The index for this document already exists. The processing will be ignored');
                  } else {

                    //index a document must be a synchronized process, because is necessary
                    //to get the stop words and the dictionary from the database, parse the
                    //document in order to check if new words must be added to the dictionary
                    //and finally update the dictionary. Concorrent process can not do all
                    //these steps at the same time.
                    logger.info('Request a lock to index the document');
                    mutex.lock(function() {
                      isLocked = true;
                      var chain = Promise.resolve();

                      logger.info('Starting the chain to index the document');
                      logger.info(data);

                      chain
                      .then(function(){
                        logger.info('Getting all the stop words for the language ', document.language);
                        return stopWordBO.getAll(document.language);
                      })
                      .then(function(result){
                        logger.info(result);

                        stopWords = result;

                        logger.info('Getting all the words in the dictionary for the language ', document.language);
                        return wordBO.getDictionary(document.systemInfoId, document.language);
                      })
                      .then(function(result){
                        logger.info(result);

                        newWords = [];
                        dictionary = result;

                        logger.info('Parsing the document and extracting the index. ');
                        logger.info('Data', data);
                        index = self.parseDocument(data, stopWords);
                        logger.info('Index', index);

                        var uniqueIndex = [];

                        //removing repeated words from the extracted index
                        index.forEach(function(element) {
                          if (uniqueIndex.indexOf(element.word) === -1) {
                            uniqueIndex.push(element.word);
                          }
                        });

                        //adding to newWords array the words needed to be persisted
                        uniqueIndex.forEach(function(element) {
                          var exists = dictionary.filter(function(item){
                            return item.word === element;
                          }).length;

                          //if the word does not exist in the words list it will be
                          //put in the newWords list to be saved
                          if (exists === 0){
                            console.log(element);
                            newWords.push(element);
                          }
                        });

                        if (newWords.length) {
                          logger.info('Saving the new words to the dictionary for the language ',
                            newWords,
                            document.systemInfoId,
                            document.language);
                          return wordBO.saveDictionary(newWords, document.systemInfoId, document.language);
                        } else {
                          logger.info('There is no word to be saved. All the words in the document are indexed');
                          return [];
                        }
                      })
                      .then(function(result){
                        logger.info('Releasing the lock. The next steps can be asynchronous');
                        //at this point the code is not necessary to be synchronized, then
                        //the mutex will be unlocked
                        mutex.unlock();

                        isLocked = false;

                        logger.info(result);

                        dictionary = dictionary.concat(result);
                        logger.info('New dictionary ', dictionary);

                        logger.info('Saving the document', document);
                        return documentBO.saveDocument(document);
                      })
                      .then(function(result) {
                        document.id = result.id;
                        logger.info('Clearing the existing document index');
                        return self.clearIndexing(document.id);
                      })
                      .then(function() {
                        logger.info('Indexing the document based on the dictionary for the language ',
                          document.language,
                          index,
                          dictionary);

                        //associating a word from the document to a word from the database
                        //and its document
                        index.forEach(function(element) {
                          if (element.word.trim().length > 0) {
                            //getting the word reference from the dictionary
                            var selectedWord = dictionary.filter(function(item){
                              return item.word === element.word;
                            });

                            element.wordId = selectedWord[0].id;
                            element.documentId = document.id;

                            //removing unnecessary properties
                            delete element.word;
                            delete element.systemInfoId;
                          }
                        });

                        logger.info('New index after parsing ');
                        logger.info(index);

                        return self.saveIndexing(index);
                      })
                      .then(function(result) {
                        logger.info('The process has finished. The index to the document has been created',
                          document,
                          result);
                        resolve({document: document, index: result});
                      })
                      .catch(function(error){
                        if (isLocked) {
                          mutex.unlock();
                        }
                        logger.error('An error has occurred in the chain. ', error);
                        reject(error);
                      });
                    });
                  }
                });
            })
            .catch(function(error){
              logger.error('An error has occurred while getting informations about the system', error);
              reject(error);
            });
        } catch (e) {
          reject(e);
        }
      });
    },

    getLocker: function() {
      return mutex;
    }
  };
}

module.exports = IndexerBO;
