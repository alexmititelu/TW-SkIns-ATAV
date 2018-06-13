var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var url = require('url');

var courseController = require('./courseController');


var serverPort = 8054;
http.createServer(function (request, response) {
   
    var path = url.parse(request.url).pathname;
    courseController.handleRequest(request, response);


}).listen(serverPort);
console.log('Server running at localhost:' + serverPort);
