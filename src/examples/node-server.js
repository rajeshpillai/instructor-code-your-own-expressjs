var http = require("http");

var server = http.createServer(function(req, res) {
  // A new request came in ...

  // You can get info about the request via `req`
  var body = "You requested " + req.method + " " + req.url;

  // You send the response status and headers using `writeHead`.
  res.writeHead(200, {
    "Content-Length": body.length,
    "Content-Type": "text/html"
  });

  // ... and the response body using `end`
  res.end(body);
});

server.listen(3000);
console.log("Listening on port 3000");
