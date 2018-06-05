var url = require('url');
var fs = require('fs');
var qs = require('querystring');
const MongoClient = require('mongodb');

function renderHTML(path, response) {
    fs.readFile("../src/html/" + path, function (error, htmlContent) {
        if (error) {
            response.writeHead(404);
            response.write("Couldn't load HTML / not found");
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.write(htmlContent);
        }
        response.end();
    });
}


module.exports = {
    handleRequest: function (request, response) {

        var path = url.parse(request.url).pathname;
        console.log("Path: " + path);

        if (request.method === "GET" && path.includes(".css") === false) {
            if (path === "/register") {
                renderHTML("createAccount.html", response);
            } else {
                response.writeHead(404);
                response.write("Couldn't load HTML / not found");
            }
        } else if (request.method === "POST") {
            console.log("Post method call");
            if (path === "/register") {
                var requestBody = '';
                console.log('Validating registration');
                request.on('data', function (data) {
                    requestBody += data;
                });

                request.on('end', function () {
                    var formData = qs.parse(requestBody);
                    console.log(formData);
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.write('<!doctype html><html><head><title>response</title></head><body>');
                    response.write('Thanks for the data!<br />User Name: ' + formData.username);
                    response.write('<br />Password: ' + formData.Password);
                    response.end('</body></html>');
                    // MongoClient
                    // .connect('mongodb://localhost:27017')
                    // .then(client => {
                    //  client.db('Skillz')
                    //   .collection('Autentificari')
                    //   .find({ email : result1.uname , password: result1.psw })
                    //   .toArray()
                    //   .then(result => {
                    //    console.log(result)
                    //    let myUser = result[0];
                    //    if( result !== undefined)
                    //     return Promise.resolve(result);
                       
                    //   })
                    //   .catch(err => {
                    //    console.log(err);
                    //    console.log('There has been an error at promises');
                    //   })
                    //   .then(user => {
                       
                    //    if(user[0] != null)
                    //    {
                    //     res.writeHead(200, {'Content-type' : 'text/html'})
                    //     res.write(user[0].username)
                    //     res.write( '<br></br>' )
                    //     res.write(user[0].password)
                    //     res.end()
                    //    }
                    //    else
                    //    {
                    //     res.writeHead(200, {'Content-type' : 'text/html'})
                    //     res.write('404402')
                    //     res.end()
                    //    }
                    //   })
                    //   .catch(err => {
                    //    console.log(err);
                    //    console.log('There has been an error at writing result');
                    //   });
                
                    //  client.close();
                    // })
                    // .catch(err => {
                    //  console.log(err);
                    //  console.log('There has been an error connecting do db');
                    // })
                
                    
                    //   });
                
                });
            } else {
                response.writeHead(404, 'Resource Not Found', { 'Content-Type': 'text/html' });
                response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
            }
        } 
        // else {
        //     response.writeHead(405, 'Method Not Supported', { 'Content-Type': 'text/html' });
        //     return response.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
        // }

    }
}