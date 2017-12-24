var SystemInfoBO     = require('../../business/SystemInfoBO');
var DAOFActory     = require('../../business/DAOFActory')();

module.exports = function() {
  var bo = new SystemInfoBO(DAOFActory.getSystemInfoDAO());

  return {
    getAll: function(req, res) {
      bo.getAll()
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
          if (r) {
            res.status(200).json(r);
          } else {
            res.status(404).json({});
          }
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    },

    create: function(req, res) {
      bo.createSystemInfo(req.body)
        .then(function(r) {
          res.status(201).json(r);
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    },

    update: function(req, res) {
      req.body.id = req.params.id;

      bo.updateSystemInfo(req.body)
        .then(function(r) {
          res.status(200).json(r);
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    },

    deleteById: function(req, res) {
      bo.deleteById(req.params.id)
        .then(function() {
          res.status(204).end();
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    }
  };
};
