var url = require('url');
var fs = require('fs');
var pathResolver = require('path');

function renderCSS(path, response) {

    var pathElements = __dirname.split("/");
    pathElements.pop();
    pathElements.pop()
    console.log(pathElements);
    console.log("PATH: " + path);
    path = "/"+path.split("/").pop();
    console.log("PATH: " + path);
    var cssPath = pathElements.join("/") + "/src/assets/css" + path;
    console.log(cssPath);

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
    fs.readFile("../src/assets" + path, function(error,image) {
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

module.exports = {
    handleRequest: function (request, response) {

        var path = url.parse(request.url).pathname;

        // console.log( './src' + path + '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

        if (path.includes('.css') && request.method === 'GET') {
                    
                    renderCSS( path, response);

            
        } else if (path.includes('.png') && request.method === 'GET') {
            console.log(path);
            renderImage(path, response);
        }
    }
}