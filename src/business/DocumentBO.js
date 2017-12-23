var Promise     = require('promise');

function DocumentBO(dao) {
  return {
    createDocument: function(document) {
      return dao.createDocument(document);
    },

    updateDocument: function(document) {
      return dao.updateDocument(document);
    },

    getByRefAndUrl: function(systemInfoId, reference, url) {
      return dao.getByRefAndUrl(systemInfoId, reference, url);
    },

    getByRefUrlHash: function(systemInfoId, reference, url, hash) {
      return dao.getByRefUrlHash(systemInfoId, reference, url, hash);
    },

    saveDocument: function(document) {
      var self = this;
      return new Promise(function(resolve, reject) {
        var chain = Promise.resolve();

        chain
          .then(function() {
            console.log(document.systemInfoId, document.reference, document.url);
            return self.getByRefAndUrl(document.systemInfoId, document.reference, document.url);
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
