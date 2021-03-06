var entry = require('../../app/controllers/entry.server.controller');
var bodyParser = require('body-parser');

require('../../config/colors');

module.exports = function(app) {

  app.route('/api/entries/dateRange')
    .post(entry.findBetweenDates);

  app.route('/api/entries')
    .get(entry.list)
    .post(entry.create);

  app.route('/api/entries/csv')
    .get(entry.getAsCSV);

  app.route('/api/entries/:entryId')
    .get(entry.read)
    .post(entry.update)
    .delete(entry.delete);

  app.route('/api/entries/load')
    .put(bodyParser.text(), entry.createFromCSV);

  app.param('entryId', entry.entryById);
}
