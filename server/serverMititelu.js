var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var url = require('url');
var registerController = require('./registerController');
var assetsController = require('./assetsController');
var courseController = require('./courseController');


var serverPort = 8051;
http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    if (path === '/courses'){
        courseController.handleRequest(request, response);
    }else {
    registerController.handleRequest(request,response);
    assetsController.handleRequest(request,response);
    }
    
    
    
}).listen(serverPort);
console.log('Server running at localhost:' + serverPort);
