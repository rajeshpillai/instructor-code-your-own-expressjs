/*
    Implement handle request
    Implement match method
    Add notFound invocation if route doesn't match
    Fixing dynamic request parameters error
    Make params value available in req.params object
    Support POST METHOD
*/
const url = require('url');
const query = require("querystring");
const log = require('../../logger/log');
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
        routes.push({
            path: url,
            callback: callback
        });
    }

    handle(req, res) {
        let parsedUrl = url.parse(req.url, true); // parse query string
        let method = req.method.trim().toLowerCase();

        let matchedRoute = this.match(req.url, method);

        if (!matchedRoute) {
            return res.notFound().end("Not found!");
        }

        // Setup request-> todo
        req = this._setupRequestParams(req, matchedRoute.params, matchedRoute.query);

        // TODO:
        if (method == "get" || method == "delete") {  // get, delete etc
            matchedRoute.match.callback(req, res);
            return;
        }

        // TODO:
        if (method === "post" || method === "put" || method === "patch") {
            //console.log(`Beginning to process ${method} request`);
            this._onPost(req, res, function postComplete(req, res) {
                //console.log(`Finished processing ${method}.`);
                matchedRoute.match.callback(req, res);
            });
        }
    }

    // todo:
    _setupRequestParams(req, params, query) {
        req.params = {};
        req.query = {};
        for (let p in params) {
            req.params[p] = params[p];
        }

        for (let q in query) {
            req.query[q] = query[q];
        }

        return req;
    }

    _onPost(req, res, onComplete) {
        let postedData = "";
        req.on("data", (chunk) => {
            postedData += chunk;
        });

        req.on("end", () => {
            let body = query.parse(postedData);
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
        log(`Searching ${urlpath}`);
        let methods = this.routes[method.toLowerCase()];

        log(`Found ${methods.length} matches.`);

        let urlPaths = null;   // store URL as token
        let patternToken = null;    // store route pattern as token

        let parsedUrl = url.parse(urlpath, true);  // parse query string
        log(`parsedUrl : ${JSON.stringify(parsedUrl)}`);

        // Get the URL tokens as array
        // For e.g. http://localhost:3000/users/edit/rajeshpillai will matchedRoute in
        // urlPaths = ['users','edit','rajeshpillai']
        urlPaths = parsedUrl.pathname.split("/").filter(Boolean);  // Remove empty array element

        log("Split URL's: ", urlPaths);

        let flatPath = {};

        let matchedRoute = null;

        for (let m in methods) {
            let routeObject = methods[m];
            
            log("Methods: ", routeObject);

            // Split route as array of tokens: 
            //  =>//['users', 'edit', ':username']
            patternToken = routeObject.path.split("/").filter(Boolean); // convert the route to token array

            let found = true;

            // Short circuit: 
            // if the url token and pattern token not same length, 
            //  then continue with next match
            if (urlPaths.length !== patternToken.length) {
                found = false;
                continue;   // continue with next matched method
            }

            // Loop through urlPaths = ['users','edit','rajeshpillai']
            for (let j = 0; j < urlPaths.length; j++) {
                // Loop through patternToken = ['users', 'edit', ':username']
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
                matchedRoute = routeObject;
                break;
            }
        }

        if (!matchedRoute) return;

        log("*********** FOUND *****************");
        log('matchedRoute: ', matchedRoute);

        // Loop through patternToken = ['users', 'edit', ':username']
        // and build clean route object with transformed data
        // <= Output : {username: "rajeshpillai"}
        let paramsMap = patternToken.reduce((obj, token, index) => {
            if (token.trim().length === 0) return obj;
            if (token.startsWith(":")) {
                let cleanToken = token.substr(1);  // remove colon
                obj[cleanToken] = urlPaths[index];
                return obj;
            }
            return obj;
        }, {});

        log("paramsMap: ", paramsMap);

        return {
            match: matchedRoute,
            query: parsedUrl.query,
            params: paramsMap  // todo:
        }

    }
}

module.exports = Router;