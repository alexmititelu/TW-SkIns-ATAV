var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var registerController = require('./registerController');
var assetsController = require('./assetsController');


var serverPort = 8888;
http.createServer(function (request, response) {

   
    registerController.handleRequest(request,response);
    assetsController.handleRequest(request,response);
    
}).listen(serverPort);
console.log('Server running at localhost:' + serverPort);
