module.exports = function(app) {
    var controller = app.controllers.word;

    app.route('/v1/words/:systemInfoId/:language')
      .get(controller.getAll);
};
