let Router = require('./router'),
    http = require('http'),
    Response = require('./response');


class App {
    constructor() {
        this.router = new Router();
        this.methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        this.init();
    }

    init() {
        // Create method on the instance of app
        this.methods.forEach((methods) => {
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

    listen() {
        let server = http.createServer((req, res) => {
            this.handle(req, res);
        });

        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}

module.exports = App;