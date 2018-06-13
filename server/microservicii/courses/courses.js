var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var url = require('url');

var courseController = require('./courseController');

const hostname = '127.0.0.1';
var serverPort = 8054;
http.createServer(function (request, response) {
   

    
    courseController.handleRequest(request, response);
    

}).listen(serverPort, hostname, () => {
    console.log(`Server running at http://${hostname}:${serverPort}`);
});