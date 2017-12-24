module.exports = function() {
  return {
    getSystemInfoDAO: function() {
      return require('../daos/SystemInfoDAO')();
    },
    getWordDAO: function() {
      return require('../daos/WordDAO')();
    },
    getDocumentDAO: function() {
      return require('../daos/DocumentDAO')();
    },
    getStopWordDAO: function() {
      return require('../daos/StopWordDAO')();
    },
    getIndexDAO: function() {
      return require('../daos/IndexDAO')();
    },
    getSystemInfoDAO: function() {
      return require('../daos/SystemInfoDAO')();
    }
  };
};
