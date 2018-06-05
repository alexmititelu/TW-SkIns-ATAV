var url = require('url');
var fs = require('fs');

function renderCSS(path, response) {
    fs.readFile("../src/assets/css/" + path, function (error, cssContent) {
        if (error) {
            response.writeHead(404);
            response.write("Couldn't load CSS / not found");
        } else {
            response.writeHead(200, { 'Content-Type': 'text/css' })
            response.write(cssContent);
        }
        response.end();
    });
}

function renderImage(path,response) {
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
}

module.exports = {
    handleRequest: function (request, response) {

        var path = url.parse(request.url).pathname;
        
        if (path.includes('.css') && request.method === 'GET') {
            switch (path) {
                case '/createAccount_styles.css':
                    renderCSS(path, response);
                    break;
                case '/styles.css':
                    renderCSS(path, response);
                    break;
                default:
                    console.log('test');
            }
        } else  if (path.includes('.png') && request.method === 'GET'){
            console.log(path);
            renderImage(path,response);
        }
    }
}