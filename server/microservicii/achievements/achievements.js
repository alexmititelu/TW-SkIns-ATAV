var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var url = require('url');

var achievementsController = require('./achievementsController');

const hostname = '127.0.0.1';
var serverPort = 8052;
http.createServer(function (request, response) {
   
    
    var path = url.parse(request.url).pathname;

    console.log(path)

    if (path === '/achievements'){
        achievementsController.handleRequest(request, response);
    }

}).listen(serverPort, hostname, () => {
    console.log(`Server running at http://${hostname}:${serverPort}`);
});
