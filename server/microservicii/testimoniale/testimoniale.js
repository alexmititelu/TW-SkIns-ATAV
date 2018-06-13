var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var url = require('url');

var testimonialeController = require('./testimonialeController');

const hostname = '127.0.0.1';
var serverPort = 8056;
http.createServer(function (request, response) {
   

    
        testimonialeController.handleRequest(request, response);
    

}).listen(serverPort, hostname, () => {
    console.log('Server running at localhost:' + serverPort);
});
