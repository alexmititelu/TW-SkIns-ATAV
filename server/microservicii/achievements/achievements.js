var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var url = require('url');

var achievementsController = require('./achievementsController');


var serverPort = 8052;
http.createServer(function (request, response) {
   
    var path = url.parse(request.url).pathname;
    if (path === '/achievements'){
        achievementsController.handleRequest(request, response);
    }

}).listen(serverPort);
console.log('Server running at localhost:' + serverPort);