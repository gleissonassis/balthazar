var Promise     = require('promise');
var logger      = require('../config/logger');

function DocumentBO(dao) {
  return {
    getAllByGroup: function(systemInfoId, group) {
      return dao.getAllByGroup(systemInfoId, group);
    },

    createDocument: function(document) {
      return dao.createDocument(document);
    },

    updateDocument: function(document) {
      return dao.updateDocument(document);
    },

    getByReference: function(systemInfoId, group, reference) {
      return dao.getByReference(systemInfoId, group, reference);
    },

    getByHash: function(systemInfoId, group, reference, hash) {
      return dao.getByHash(systemInfoId, group, reference, hash);
    },

    getById: function(id) {
      return dao.getById(id);
    },

    searchDocuments: function(systemInfoId, query) {
      logger.info('Searching documents ', systemInfoId, query);
      return dao.searchDocuments(systemInfoId, query);
    },

    saveDocument: function(document) {
      var self = this;
      return new Promise(function(resolve, reject) {
        var chain = Promise.resolve();

        chain
          .then(function() {
            return self.getByReference(document.systemInfoId, document.group, document.reference);
          })
          .then(function(r) {
            console.log(r);
            if (r) {
              document.id = r.id;
              return self.updateDocument(document);
            } else {
              return self.createDocument(document);
            }
          })
          .then(resolve)
          .catch(reject);
      });
    }
  };
}

module.exports = DocumentBO;
