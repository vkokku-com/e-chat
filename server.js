var http = require('http');
var Assets = require('./backend/Assets');
var port = 9000;
var host = '127.0.0.1';

var app = http.createServer(Assets).listen(port, host);
console.log("Listening on " + host + ":" + port);
