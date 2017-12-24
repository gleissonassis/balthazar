var WordBO        = require('../../business/WordBO');
var DAOFActory     = require('../../business/DAOFActory')();

module.exports = function() {
  var bo = new WordBO(DAOFActory.getWordDAO());

  return {
    getAll: function(req, res) {
      bo.getDictionary(req.params.systemInfoId, req.params.language)
        .then(function(r) {
          res.status(200).json(r);
        })
        .catch(function(error) {
          res.status(error.status).json(error);
        });
    }
  };
};
