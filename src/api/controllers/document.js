var StopWordBO      = require('../../business/StopWordBO');
var DocumentBO      = require('../../business/DocumentBO');
var WordBO          = require('../../business/WordBO');
var IndexerBO       = require('../../business/IndexerBO');
var SystemInfoBO    = require('../../business/SystemInfoBO');
var DAOFActory      = require('../../business/DAOFActory')();

module.exports = function() {
  var bo = new DocumentBO(DAOFActory.getDocumentDAO());

  return {
    getAllByGroup: function(req, res) {
      bo.getAllByGroup(req.params.systemInfoId, req.params.group)
        .then(function(r) {
          res.status(200).json(r);
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    },

    getByReference: function(req, res) {
      bo.getByReference(req.params.systemInfoId, req.params.group, req.params.reference)
        .then(function(r) {
          res.status(200).json(r);
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    },

    getById: function(req, res) {
      bo.getById(req.params.id)
        .then(function(r) {
          res.status(200).json(r);
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    },

    save: function(req, res) {
      var indexerBO = new IndexerBO({
        dao: DAOFActory.getIndexDAO(),
        wordBO: new WordBO(DAOFActory.getWordDAO()),
        stopWordBO: new StopWordBO(DAOFActory.getStopWordDAO()),
        documentBO: bo,
        systemInfoBO: new SystemInfoBO(DAOFActory.getSystemInfoDAO())
      });

      req.body.systemInfoId = req.params.systemInfoId;
      req.body.group = req.params.group;
      req.body.reference = req.params.reference ?
        req.params.reference :
        req.body.reference;

      //removing a property id (if its exists) to avoid database conflicts
      delete req.body.id;

      indexerBO.buildIndex(req.body)
        .then(function(r) {
          if (r.index.length) {
            res.status(200).json(r.document);
          } else {
            res.status(304).end();
          }
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    },

    searchDocuments: function(req, res) {
      if (req.query.q === undefined) {
        res.status(400).json({
          status: 400,
          message: 'The q (search query) parameter is required'
        });
      } else {
        bo.searchDocuments(req.params.systemInfoId, req.query.q)
          .then(function(r) {
            res.status(200).json(r);
          })
          .catch(function(error) {
            res.status(error.status).json(error);
          });
      }
    }
  };
};
