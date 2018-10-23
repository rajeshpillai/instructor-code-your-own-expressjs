/*
    Implement handle request
    Implement match method
    Add notFound invocation if route doesn't match
    Fixing dynamic request parameters error
    Make params value available in req.params object
    Support POST METHOD
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
            // todo:
            if (!token.startsWith(":")) {
                return arr.concat(patternToken[index]);  // grab the token
            } else return arr;
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
        console.log("parsedUrl: ", parsedUrl);
        let method = req.method.trim().toLowerCase();

        let result = this.match(req.url, method);

        console.log("HTTP: ", method);

        if (!result) {
            return res.notFound().end("Not found!");
        }

        // Setup request-> todo
        req = this._setupRequestParams(req, result.params, result.qs);

        // TODO:
        if (method !== 'post' && method !== "put") {  // get, delete etc
            console.log("WHY HERE ? ", method);
            result.match.callback(req, res);
            return;
        }

        // TODO:
        if (method === "post" || method === "put") {
            this._onPost(req, res, function postComplete(req, res) {
                result.match.callback(req, res);
            });
        }
    }

    // todo:
    _setupRequestParams(req, params, query) {
        req.params = {};
        req.qs = {};
        for (let p in params) {
            req.params[p] = params[p];
        }

        for (let q in query) {
            req.qs[q] = query[q];
        }

        return req;
    }

    _onPost(req, res, onComplete) {
        let postedData = "";
        req.on("data", (chunk) => {
            postedData += chunk;
        });

        req.on("end", () => {
            let body = qs.parse(postedData);
            req.rawBody = postedData;

            //TODO: NEED WORK HERE
            if (postedData && postedData.indexOf('{') > -1) {
                req.body = JSON.parse(postedData);
            } else {
                req.body = postedData;
            }

            onComplete(req, res);
        });
    }

    match(urlpath, method = "get") {
        let methods = this.routes[method.toLowerCase()];

        let urlPaths = null;   // store URL as token
        let patternToken = null;    // store route pattern as token

        let parsedUrl = url.parse(urlpath, true);  // parse query string

        urlPaths = parsedUrl.pathname.split("/").filter(Boolean);  // Remove empty array element
        //OR urlPaths = parsedUrl.filter(v=>v!='');

        let flatPath = {};

        let matchObject = null;

        for (let m in methods) {
            let routeObject = methods[m];
            patternToken = routeObject.path.split("/").filter(Boolean); // convert the route to token array

            console.log("urlPaths: ", urlPaths);
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

        // todo:
        let paramsMap = patternToken.reduce((arr, token, index) => {
            if (token.trim().length === 0) return arr;
            if (token.startsWith(":")) {
                let cleanToken = token.substr(1);  // remove colon
                arr[cleanToken] = urlPaths[index];
                return arr;
            }
            return arr;
        }, {});

        return {
            match: matchObject,
            qs: parsedUrl.query,
            params: paramsMap  // todo:
        }

    }
}

module.exports = Router;