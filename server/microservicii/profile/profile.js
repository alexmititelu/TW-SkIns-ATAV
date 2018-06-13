var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var profileController = require('./profileController');
//var assetsControllerVlad = require('./assetsControllerVlad');


var port = 8055;
const hostname = '127.0.0.1';

const server = http.createServer(function (req, res) {

    profileController.handleRequest(req,res);
    //assetsControllerVlad.handleRequest(req,res);
    
});

server.listen(port, hostname, ()=> {
	console.log('Server started at port ' + port);
});
