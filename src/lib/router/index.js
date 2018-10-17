const url = require('url');
const qs = require("querystring");
const { METHODS } = require("http");

class Router {
    constructor() {
        this.routes = {};  // a hash
        METHODS.forEach(verb => {
            this.routes[verb.toLowerCase()] = [];

            // Add methods to 'this' instance
            this[verb.toLowerCase()] = (path, callback) => {
                this.routes(verb, path, callback);
            }
        })
    }

    route(method, url, callback) {
        let routes = this.routes[method.toLowerCase()];  // There can be more than one route matching

        let patternToken = url.split("/");
        let combinedKey = patternToken.reduce((arr, token, index) => {
            return arr;  // for now
        }, []).join('');

        console.log("key: ", combinedKey);

        routes.push({
            path: url,
            key: combinedKey,
            callback: callback
        });
    }

    handle(req, res) {

    }
}

module.exports = Router;