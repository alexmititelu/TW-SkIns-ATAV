var url = require('url');
var fs = require('fs');

function renderCSS(path, res) {
    fs.readFile("../src/assets/css/" + path, function (error, cssContent) {
        if (error) {
            res.writeHead(404);
            res.write("Couldn't load CSS / not found");
        } else {
            res.writeHead(200, { 'Content-Type': 'text/css' })
            res.write(cssContent);
        }
        res.end();
    });
}

function renderImage(path,res) {
    fs.readFile(path, function(error,content) {
        if (error) {
            res.writeHead(404);
            res.write("Couldn't load Image / not found");
        } else {
            console.log('Succes at reading image');
            res.writeHead(200, { 'Content-Type': 'image/png' })
            res.write('test');
        }
        res.end(content);
    });
}

module.exports = {
    handleRequest: function (req, res) {

        var path = url.parse(req.url).pathname;
        
        if (path.includes('.css') && req.method === 'GET') {
            switch (path) {
                case '/profile_styles.css':
                    renderCSS(path, res);
                    break;
                case '/styles.css':
                    renderCSS(path, res);
                    break;
                default:
                    console.log('test');
            }
        } else  if (path.includes('.png') && req.method === 'GET'){
            console.log(path);
            renderImage(path,res);
        }
    }
}