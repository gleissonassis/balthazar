function SystemInfoBO(dao) {
  return {
    getAll: function() {
      return dao.getAll();
    },

    createSystemInfo: function(systemInfo) {
      return dao.createSystemInfo(systemInfo);
    },

    updateSystemInfo: function(systemInfo) {
      return dao.updateSystemInfo(systemInfo);
    },

    getById: function(id) {
      return dao.getById(id);
    },

    deleteById: function(id) {
      return dao.deleteById(id);
    }
  };
}

module.exports = SystemInfoBO;
