/*
    Implement handle request
*/

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

    // todo:
    handle(req, res) {
        let parsedUrl = url.parse(req.url, true); // parse query string
        let result = this.match(req.url, req.method);
        if (!result) {
            return null; // res.notFound().end("Not found!"); // todo
        }

        // Setup request->todo

        if (req.method.toLowerCase() === 'get') {
            result.match.callback(req, res);
            return;
        }
    }
}

module.exports = Router;