/***
 * Add support for view engine (install serve-static npm)
 * 
 */
let Router = require('./router'),
    http = require('http'),
    cons = require('consolidate'),  // TODO:
    Response = require('./response');


class App {
    constructor() {
        this.router = new Router();
        this.methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        this.settings = {};
        this.init();
    }

    init() {
        // Create method on the instance of app
        this.methods.forEach((method) => {
            this[method.toLowerCase()] = (path, callback) => {
                this.router.route(method, path, callback);
            }
        });
    }

    handle(req, res) {
        res.__proto__ = Response.prototype;
        res.app = this;   // used in res.render
        this.router.handle(req, res);
    }

    // TODO:
    render(file, locals, callback) {
        let engineName = this.settings['view engine'],
            engine = cons[engineName],
            path = this.settings['views'] + '/' + file + '.' + engineName; // Optimization required

        engine(path, locals, function (err, html) {
            if (err) throw err;
            callback(html);
        });
    }

    // TODO:
    set(name, value) {
        this.settings[name] = value;
    }

    listen(port, hostname) {
        let server = http.createServer((req, res) => {
            this.handle(req, res);
        });

        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}

module.exports = App;