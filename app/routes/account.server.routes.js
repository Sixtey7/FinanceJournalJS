var account = require('../../app/controllers/account.server.controller');
var bodyParser = require('body-parser');

require('../../config/colors');

module.exports = function(app) {
    app.route('/api/accounts')
        .get(account.list)
        .post(account.create);

    app.route('/api/accounts/:accountId')
        .get(account.read)
        .post(account.update)
        .delete(account.delete);

    app.param('accountId', account.accountById);
}