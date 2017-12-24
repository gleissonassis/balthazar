module.exports = function(app) {
    var controller = app.controllers.api;

    app.route('/v1/status')
      .get(controller.getAPIInfo);
};
