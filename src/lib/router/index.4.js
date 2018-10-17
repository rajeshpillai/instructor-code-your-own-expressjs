/*
    Implement handle request
    Implement match method
    Add notFound invocation if route doesn't match
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

    handle(req, res) {
        let parsedUrl = url.parse(req.url, true); // parse query string
        let result = this.match(req.url, req.method);
        if (!result) {
            return res.notFound().end("Not found!"); // todo
        }

        // Setup request->

        if (req.method.toLowerCase() === 'get') {
            result.match.callback(req, res);
            return;
        }
    }

    match(urlpath, method = "get") {
        let methods = this.routes[method.toLowerCase()];

        let urlPaths = null;   // store URL as token
        let patternToken = null;    // store route pattern as token

        let parsedUrl = url.parse(urlpath, true);  // parse query string

        urlPaths = parsedUrl.pathname.split("/").filter(String);  // convert the url to token array

        let flatPath = {};

        let matchObject = null;

        for (let m in methods) {
            let routeObject = methods[m];
            patternToken = routeObject.path.split("/").filter(String); // convert the route to token array

            console.log("patternToken: ", patternToken);

            let found = true;

            // if the url token and pattern token not same length, then false
            if (urlPaths.length !== patternToken.length) {
                found = false;
                continue;   // continue with next method
            }

            for (let j = 0; j < urlPaths.length; j++) {
                for (let k = 0; k < patternToken.length; k++) {
                    let token = patternToken[k];
                    if (!token.startsWith(":")) {
                        if (token !== urlPaths[k]) {
                            found = false;
                        }
                    }
                }
            }

            if (found) {
                matchObject = routeObject;
                break;
            }
        }

        if (!matchObject) return;

        console.log('matchOBject: ', matchObject);

        return {
            match: matchObject,
            qs: parsedUrl.query
        }

    }
}

module.exports = Router;