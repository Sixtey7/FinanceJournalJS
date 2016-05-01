var entry = require('../../app/controllers/entry.server.controller');
require('../../config/colors');

module.exports = function(app) {
  app.route('/api/entries')
    .get(entry.list)
    .post(entry.create);

  app.route('/api/entries/:entryId')
    .get(entry.read)
    .put(entry.update)
    .delete(entry.delete);

  app.param('entryId', entry.entryById);
}
