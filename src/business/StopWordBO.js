function StopWordBO(dao) {
  return {
    getAll: function(language) {
      return dao.getAll(language);
    }
  };
}

module.exports = StopWordBO;
