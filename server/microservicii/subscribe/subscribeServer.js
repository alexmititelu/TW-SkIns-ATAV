var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var subscribeController = require('./subscribeController');

var port = 8888;
const hostname = '127.0.0.1';

const server = http.createServer(function (req, res) {

    subscribeController.handleRequest(req,res);
    
});

server.listen(port, hostname, ()=> {
	console.log('Server started at port ' + port);
});
