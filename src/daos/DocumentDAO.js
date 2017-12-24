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
              logger.error('An error has occurred while saving the document ', document, err);
              reject(connection.parseError(err));
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
        '`group` = ?, ' +
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
          document.group,
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
              logger.error('An error has occurred while updating the document ', document, err);
              reject(connection.parseError(err));
            } else {
              logger.info('The document has been updated successfully', document);
              resolve(document);
            }
          });
      });
    },

    getAllByGroup: function(systemInfoId, group) {
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM Document WHERE systemInfoId = ? AND `group` = ? ORDER BY title',
        [systemInfoId, group],
        function(err, result) {
            if (err) {
              reject(connection.parseError(err));
            } else {
              resolve(result);
            }
          });
      });
    },

    getByReference: function(systemInfoId, group, reference) {
      return new Promise(function(resolve, reject) {
        connection.query(
          'SELECT * FROM Document WHERE systemInfoId = ? AND `group` = ? AND reference = ? ORDER BY title',
          [systemInfoId, group, reference],
          function(err, result) {
              if (err) {
                reject(connection.parseError(err));
              } else {
                resolve(result && result.length ? result[0] : null);
              }
            });
      });
    },

    searchDocuments: function(systemInfoId, q) {
      return new Promise(function(resolve, reject) {
        var words = q.split(' ');
        var query = 'SELECT DISTINCT D.* FROM Document D ' +
                    'INNER JOIN `Index` I ON D.id = I.documentId ' +
                    'INNER JOIN Word W on W.id = I.wordId ' +
                    'WHERE 1 = 1';

        words.forEach(function(word) {
          query += ' AND ('+
                   'W.word LIKE ' + connection.escape('%' + word + '%') + ' ' +
                   ' OR '+
                   ' W.phonem = ' +
                   'IF(W.language=\'pt-br\', '+
                   'phonembr(' + connection.escape(word) + '), SOUNDEX(' + connection.escape(word) + ')))';
        });

        query += ' ORDER BY D.modifiedAt DESC, D.createdAt DESC';

        connection.query(query,
          function(err, result) {
              if (err) {
                reject(connection.parseError(err));
              } else {
                resolve(result);
              }
            });
      });
    },

    getById: function(id) {
      return new Promise(function(resolve, reject) {
        connection.query(
          'SELECT * FROM Document WHERE id = ?',
          [id],
          function(err, result) {
              if (err) {
                reject(connection.parseError(err));
              } else {
                resolve(result && result.length ? result[0] : null);
              }
            }
          );
      });
    },

    getByHash: function(systemInfoId, group, reference, hash) {
      return new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM Document WHERE systemInfoId = ? AND `group` = ? AND reference = ? AND hash = ?',
        [systemInfoId, group, reference, hash],
        function(err, result) {
            if (err) {
              reject(connection.parseError(err));
            } else {
              resolve(result && result.length ? result[0] : null);
            }
          });
      });
    },
  };
}

module.exports = DocumentDAO;
