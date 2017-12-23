var connection  = require('../config/mysql');
var logger      = require('../config/logger');
var Promise     = require('promise');

function DocumentDAO() {
  return {
    createDocument: function(document) {
      return new Promise(function(resolve, reject) {
        logger.info('Creating new document ', document);
        connection.query('INSERT INTO Document SET ?', document, function(err, result) {
            if (err) {
              logger.error('An error has occurred while saving the document ', document);
              reject(err);
            } else {
              document.id = result.insertId;

              logger.info('The document has been saved successfully', document);
              resolve(document);
            }
          });
      });
    },

    updateDocument: function(document) {
      return new Promise(function(resolve, reject) {
        logger.info('Updating the document ', document);
        connection.query('UPDATE Document SET systemInfoId = ?, ' +
        'title = ?, ' +
        'reference = ?, '+
        'url = ?, ' +
        'contents = ?, ' +
        'hash = ?, ' +
        'createdAt = ?, ' +
        'createdBy = ?, ' +
        'modifiedAt = ?, ' +
        'modifiedBy = ? '+
        'WHERE id = ?', [
          document.systemInfoId,
          document.title,
          document.reference,
          document.url,
          document.contents,
          document.hash,
          document.createdAt,
          document.createdBy,
          document.modifiedAt,
          document.modifiedBy,
          document.id
        ], function(err) {
            if (err) {
              logger.error('An error has occurred while updating the document ', document);
              reject(err);
            } else {
              logger.info('The document has been updated successfully', document);
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

    getByRefUrlHash: function(systemInfoId, reference, url, hash) {
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM Document WHERE systemInfoId = ? AND reference = ? AND url = ? AND hash = ?',
        [systemInfoId, reference, url, hash],
        function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result && result.length ? result[0] : null);
            }
          });
      });
    },
  };
}

module.exports = DocumentDAO;
