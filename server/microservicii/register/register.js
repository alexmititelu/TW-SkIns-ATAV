var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var url = require('url');
var registerController = require('./registerController');

var serverPort = 8051;
http.createServer(function (request, response) {
    
    var path = url.parse(request.url).pathname;
    if (path.startsWith('/register')){
        registerController.handleRequest(request,response);
    }

}).listen(serverPort);
console.log('Server running at localhost:' + serverPort);
