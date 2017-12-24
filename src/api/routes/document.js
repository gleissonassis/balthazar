module.exports = function(app) {
    var controller = app.controllers.document;

    app.route('/v1/documents/:systemInfoId')
      .get(controller.searchDocuments);
    app.route('/v1/documents/:systemInfoId/:group')
      .post(controller.save)
      .get(controller.getAllByGroup);
    app.route('/v1/documents/:systemInfoId/:group/:reference')
      .put(controller.save)
      .get(controller.getByReference);
    app.route('/v1/documents/:id')
      .get(controller.getById);
};
