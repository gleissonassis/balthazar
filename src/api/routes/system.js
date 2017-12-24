module.exports = function(app) {
    var controller = app.controllers.system;

    app.route('/v1/systems')
      .get(controller.getAll)
      .post(controller.create);

    app.route('/v1/systems/:id')
      .get(controller.getById)
      .delete(controller.deleteById)
      .put(controller.update);
};
