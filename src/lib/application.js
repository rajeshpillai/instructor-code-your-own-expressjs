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
      //todo: param as arrays (last function being the callback, and other
      // functions could be middlewares )
      this[method.toLowerCase()] = (path, ...callback) => {
        this.router.route(method, path, callback);
      };
    });
  }

  // TODO: middleware
  /*
    Two uses cases supported
    1. app.use(fn);
    2. app.use("/path", router);
  */

  use(callback) {
    // check if router middleware ; app.use("/router", router);
    if (typeof callback !== 'function') {
      let fn = arguments[1]; // The router
      fn.scope = callback; // The path
      this.middlewares.push(fn);
    } else {
      this.middlewares.push(callback);
    }
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
          if (middleware.handle) {  // Check if the middleware is router
            console.log("REQ:", req.url);
            console.log("MW:", middleware.scope);
            // Trim the scope and send it to the middleware
            if (req.url.startsWith(middleware.scope)) {
              middleware.handle(req, res);
            } else {
              next();
            }
          } else {
            middleware(req, res, next);
          }
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

    engine(path, locals, function (err, html) {
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
