var connection = require('../config/mysql');
var Promise = require('promise');

function DocumentBO() {
  return {
    createDocument: function(document) {
      return new Promise(function(resolve, reject) {
        connection.query('INSERT INTO Document SET ?', document, function(err, result) {
            if (err) {
              reject(err);
            } else {
              document.id = result.insertId;
              resolve(document);
            }
          });
      });
    },

    updateDocument: function(document) {
      return new Promise(function(resolve, reject) {
        connection.query('UPDATE Document SET SystemInfoId = ?, Title = ?, Reference = ?, Url = Url, CreatedAt = ?, CreatedBy = ?, ModifiedAt = ?, ModifiedBy = ? WHERE Id = ?', [
          document.systemInfoId,
          document.title,
          document.reference,
          document.url,
          document.createAt,
          document.createdBy,
          document.modifiedAt,
          document.modifiedBy,
          document.id
        ], function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(document);
            }
          });
      });
    },

    getByRefAndUrl: function(systemInfoId, reference, url) {
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM Document WHERE systemInfoId = ? AND reference = ? AND url = ?',
        [systemInfoId, reference, url],
        function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result && result.length ? result[0] : null);
            }
          });
      });
    },

    saveDocument: function(document) {
      return new Promise((resolve, reject) => {
        var chain = Promise.resolve();

        chain
          .then(() => {
            return this.getByRefAndUrl(document.systemInfoId, document.reference, document.url);
          })
          .then((r) => {
            if(r) {
              document.id = r.id;
              return this.updateDocument(document);
            } else {
              return this.createDocument(document);
            }
          })
          .then(resolve)
          .catch(reject);
      });
    }
  };
}

module.exports = DocumentBO;
