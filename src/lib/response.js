var http = require('http')

// Our own Response class.
// We make `res` inherit from this to add our own helper methods.
class Response extends http.ServerResponse {
    constructor() {
        super();
    }

    send(status, body) {
        if (body == null) {
            body = status;   // If only one parameter
            status = this.statusCode || 200;
        }

        let contentLength = body ? body.length : 0;
        //console.log("this: ", this.contentType);
        this.writeHead(status, {
            'Content-Length': contentLength,
            'Content-Type': this.contentType
        })
        this.end(body)
    }

    json(body) {
        this.contentType = "application/json";
        body = JSON.stringify(body);
        this.send(body);
    }

    status(code) {
        this.statusCode = code;
        return this;
    }

    notFound(code) {
        this.statusCode = 404;
        return this;
    }

    redirect(url) {
        // writeHead comes from http (response)
        this.writeHead(302, {
            'Location': url
            //add other headers here...
        });
        this.end();
    }

    render(file, locals = {}) {
        var self = this
        // Invoke render of the app
        this.app.render(file, locals, function (html) {
            self.send(html)
        })
    }
}
Response.prototype.contentType = 'text/html'


module.exports = Response;