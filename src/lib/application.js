/***
 * Add support for view engine (install serve-static npm)
 * Adding support for middlewares
 *
 */
let Router = require("./router"),
  http = require("http"),
  cons = require("consolidate"), // TODO:
  Response = require("./response");

class App {
  constructor() {
    this.router = new Router();
    this.methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    this.settings = {};
    this.middlewares = []; // TODO:
    this.init();
  }

  init() {
    // Create method on the instance of app
    this.methods.forEach(method => {
      this[method.toLowerCase()] = (path, callback) => {
        this.router.route(method, path, callback);
      };
    });
  }

  // TODO: middleware
  use(callback) {
    this.middlewares.push(callback);
    return this; // support method chaining
  }

  // TODO:  middleware support
  handle(req, res) {
    res.__proto__ = Response.prototype;
    res.app = this; // used in res.render

    let index = 0; // current middleware

    let next = () => {
      let middleware = this.middlewares[index++];
      try {
        if (middleware) {
          middleware(req, res, next);
        } else {
          this.router.handle(req, res);
        }
      } catch (e) {
        if (e.status) {
          res.send(e.status, e.message);
        } else {
          throw e;
        }
      }
    };

    next();
  }

  // TODO:
  render(file, locals, callback) {
    let engineName = this.settings["view engine"],
      engine = cons[engineName],
      path = this.settings["views"] + "/" + file + "." + engineName; // Optimization required

    engine(path, locals, function(err, html) {
      if (err) throw err;
      callback(html);
    });
  }

  // TODO:
  set(name, value) {
    this.settings[name] = value;
  }

  listen(port, callback) {
    let server = http.createServer((req, res) => {
      this.handle(req, res);
    });

    return server.listen.apply(server, arguments);

    // server.listen(port, () => {
    //   console.log(`Server running on port ${port}`);
    //   callback();
    //   return server;
    // });
  }
}

module.exports = App;
