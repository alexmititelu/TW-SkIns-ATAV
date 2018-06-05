var url = require('url');
var fs = require('fs');
var qs = require('querystring');
const MongoClient = require('mongodb').MongoClient;

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

                    // response.write('<!doctype html><html><head><title>response</title></head><body>');
                    // response.write('Thanks for the data!<br />User Name: ' + formData.username);
                    // response.write('<br />Password: ' + formData.password);
                    // response.end('</body></html>');
                    // // connection.db('Skillz')
                    //   .collection('Autentificari')
                    //   .insertOne({
                    // response.redirect('/register');

                    MongoClient
                        .connect('mongodb://localhost:27017', function (error, connection) {
                            if (error) {
                                throw error;
                            }

                            var dbConnection = connection.db("TW_PROJECT_SkIns");
                            var newAccount = {
                                username: formData.username,
                                password: formData.password,
                                email: formData.email
                            };

                            dbConnection.collection("Conturi").insertOne(newAccount, function (error, success) {
                                if (error) {
                                    throw error;
                                }

                                console.log("Am adaugat un cont nou");

                                var query = { username: newAccount.username };
                                var idCont = dbConnection.collection("Conturi").find(query).toArray(function (queryError, queryResult) {

                                    if (queryError) {
                                        throw queryError;
                                    }

                                    console.log(queryResult[0]._id);


                                    var newAccountDetails = {
                                        cont_id: queryResult[0]._id,
                                        first_name: formData.firstName,
                                        last_name: formData.lastName,
                                        telefon: formData.phone,
                                        gender: formData.gender,
                                        interests: formData.interests,
                                        isSubscribed: formData.subscribe
                                    };

                                    dbConnection.collection("Utilizatori").insertOne(newAccountDetails, function (error, success) {
                                        if (error) {
                                            throw error;
                                            connection.close();
                                        }
                                        connection.close();
                                    });
                                    console.log("Am adaugat si user details");
                                    // renderHTML("createdAccount.html",response);
                                    /**/

                                    response.writeHead(200, { 'Content-Type': 'text/html' });
                                    response.write("Thanks");
                                    response.end();


                                    // fs.readFile("../src/html/createdAccount.html", function (error, htmlContent) {
                                    //     if (error) {
                                    //         response.writeHead(404);
                                    //         response.write("Couldn't load HTML / not found");
                                    //     } else {
                                    //         response.writeHead(200, { 'Content-Type': 'text/html' })
                                    //         response.write(htmlContent);
                                    //     }
                                    //     response.end();
                                    // });

                                    /**/
                                });
                            });
                        });
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