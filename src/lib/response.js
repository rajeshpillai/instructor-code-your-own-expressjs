var http = require('http')

// Our own Response class.
// We make `res` inherit from this to add our own helper methods.
function Response() { }

Response.prototype = Object.create(http.ServerResponse.prototype)
Response.prototype.constructor = Response


// Default Content-Type to HTML.
Response.prototype.contentType = 'text/html'

// Helper to send a response.
// Usage:
//   res.send('body')
//   res.send(404, 'Not found')
Response.prototype.send = function (status, body) {
    if (body == null) {
        body = status;   // If only one parameter
        status = this.statusCode || 200;
    }

    let contentLength = body ? body.length : 0;
    this.writeHead(status, {
        'Content-Length': contentLength,
        'Content-Type': this.contentType
    })
    this.end(body)
}

Response.prototype.status = function status(code) {
    this.statusCode = code;
    return this;
};

Response.prototype.notFound = function notFound(code) {
    this.statusCode = 404;
    return this;
};

Response.prototype.json = function (body) {
    this.contentType = "application/json";
    body = JSON.stringify(body);
    this.send(body);
}

Response.prototype.redirect = function (url) {
    this.writeHead(302, {
        'Location': url
        //add other headers here...
    });
    this.end();
}

Response.prototype.render = function (file, locals = {}) {
    var self = this

    this.app.render(file, locals, function (html) {
        self.send(html)
    })
}

module.exports = Response;