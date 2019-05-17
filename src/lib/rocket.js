let App = require('./application');

exports = module.exports = createApplication;

function createApplication() {
    let app = new App();
    return app;
}

exports.static = require('serve-static');
exports.Router = () => new (require('./router'));