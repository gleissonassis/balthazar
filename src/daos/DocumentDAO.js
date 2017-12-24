var connection  = require('../config/mysql');
var logger      = require('../config/logger');
var _           = require('underscore');
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
      var self = this;

      return new Promise(function(resolve, reject) {
        var words = q.split(' ');

        var query = '';

        words.forEach(function(word, index) {
          /*query += ' AND ('+
                   'W.word LIKE ' + connection.escape('%' + word + '%') + ' ' +
                   ' OR '+
                   ' W.phonem = ' +
                   'IF(W.language=\'pt-br\', '+
                   'phonembr(' + connection.escape(word) + '), SOUNDEX(' + connection.escape(word) + ')))';*/
         if (index > 0) {
           query += ' UNION ALL ';
         }
         query += 'SELECT DISTINCT I.documentId, ' + connection.escape('%' + word + '%') + ' as word ' +
                     'FROM Word W INNER JOIN `Index` I ON I.wordId = W.id ' +
                     'WHERE W.word LIKE '+ connection.escape('%' + word + '%');
        });

        connection.query(query,
          function(err, result) {
              if (err) {
                reject(connection.parseError(err));
              } else {
                var groups = _.groupBy(result, 'word');
                var a = [];
                for (var k in groups) {
                  a.push(groups[k].map(function(i) {
                    return i.documentId;
                  }));
                }

                self.getByIds(_.intersection.apply(_, a))
                  .then(resolve)
                  .catch(reject);
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

    getByIds: function(ids) {
      return new Promise(function(resolve, reject) {
        connection.query(
          'SELECT * FROM Document WHERE id in (' + ids.join(',') + ')',
          function(err, result) {
              if (err) {
                reject(connection.parseError(err));
              } else {
                resolve(result);
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
