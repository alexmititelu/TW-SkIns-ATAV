var url = require('url');
var fs = require('fs');
var pathResolver = require('path');

var pathElements = __dirname.split(pathResolver.sep);
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join(pathResolver.sep);

function renderCSS(path, response) {

    var cssPath = homePath + "/src/assets/css" + path;

    fs.readFile(cssPath, function (error, cssContent) {
        if (error) {
            console.log(error);
            // console.log("../src/assets/css/" + path + '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            response.writeHead(404);
            response.write("Couldn't load CSS / not found");
        } else {

            response.writeHead(200, { 'Content-Type': 'text/css' })
            response.write(cssContent);
        }
        response.end();
    });
}

function renderImage(path, response) {

    var imagePath = homePath + "/src/assets/images" + path;

    fs.readFile(imagePath, function (error, image) {
        if (error) {
            response.writeHead(404);
            response.write("Couldn't load Image / not found");
        } else {
            console.log('Succes at reading image');
            response.writeHead(200, { 'Content-Type': 'image/gif' })
            response.write('test');
        }
        response.end();
    });
    // var file = fs.createReadStream("../src/assets" + path);
    // file.on('open', function () {
    //     response.setHeader('Content-Type', 'image/png');
    //     file.pipe(response);
    // });
    // response.sendfile("../src/assets"+path);
}


function renderJS(path, response) {

    var jsPath = homePath + "/src/assets/scripts" + path;

    fs.readFile(jsPath, function (error, jsContent) {
        if (error) {
            console.log(error);
            response.writeHead(404);
            response.write("Couldn't load script / not found");
        } else {

            response.writeHead(200, { 'Content-Type': 'text/javascript' })
            response.write(jsContent);
        }
        response.end();
    });
}


module.exports = {
    handleRequest: function (request, response) {

        var path = url.parse(request.url).pathname;

        // console.log( './src' + path + '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

        if (path.includes('.css') && request.method === 'GET') {

            renderCSS(path, response);


        } else if (path.includes('.png') && request.method === 'GET') {
            console.log(path);
            renderImage(path, response);
        }

        if (path.includes('.js') && request.method === 'GET') {
            console.log(path);
            renderJS(path, response);
        }
    }
}