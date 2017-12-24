var Promise       = require('promise');
var logger        = require('../config/logger');

function WordBO(dao) {
  return {
    getDictionary: function(systemInfoId, language) {
      logger.info('Getting the dictionary for ', systemInfoId, language);
      return dao.getDictionary(systemInfoId, language);
    },

    saveWord: function(word) {
      return dao.saveWord(word);
    },

    saveDictionary: function(dictionary, systemInfoId, language) {
      var self = this;
      var p = [];

      dictionary.forEach(function(word) {
        p.push(self.saveWord({
          word: word,
          language: language,
          systemInfoId: systemInfoId
        }));
      });

      return Promise.all(p);
    }
  };
}

module.exports = WordBO;
