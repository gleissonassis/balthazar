function SystemInfoBO(dao) {
  return {
    createSystemInfo: function(systemInfo) {
      return dao.createSystemInfo(systemInfo);
    },

    updateSystemInfo: function(systemInfo) {
      return dao.updateSystemInfo(systemInfo);
    },

    getById: function(id) {
      return dao.getById(id);
    }
  };
}

module.exports = SystemInfoBO;
