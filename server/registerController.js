var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const MongoClient = require('mongodb').MongoClient;

function sendRegistrationMail(destinationEmail, username, activationLink, success) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'skinsvirtualinstructor@gmail.com',
            pass: 'parolaSkIns10'
        }
    });

    var mailOptions = {
        from: 'skinsvirtualinstructor@gmail.com',
        to: destinationEmail,
        subject: 'Sending Email using Node.js',
        html: '<h1>Welcome ' + username + '</h1>' +
            '<p>In order to activate your account click on the following link: <br>localhost:8888/register/' + activationLink + '</p> ' +
            '<br><br> <p>© SkIns</p>'
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

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

        if (request.method === "GET" && path.includes(".css") === false) {
            if (path === "/register") {
                renderHTML("createAccount.html", response);
            } else {
                response.writeHead(404);
                response.write("Couldn't load HTML / not found");
            }
        } else if (request.method === "POST") {
            if (path === "/register") {
                var requestBody = '';
                request.on('data', function (data) {
                    requestBody += data;
                });

                request.on('end', function () {
                    var formData = qs.parse(requestBody);

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

                                var query = { username: newAccount.username };
                                var idCont = dbConnection.collection("Conturi").find(query).toArray(function (queryError, queryResult) {

                                    if (queryError) {
                                        throw queryError;
                                    }

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
                                           
                                        }
                                    });
                                    
                                    var newToken = randomstring.generate(64);
                                    
                                    var query = { token: newToken };

                                    varconturi = dbConnection.collection("Tokens").find(query).toArray(function (queryError, queryResult) {

                                        if (queryError) {
                                            throw queryError;
                                        }

                                        if (!(queryResult.length === 0)) {
                                            newToken = randomstring.generate(64);
                                        } else {


                                            var newTokenRow = {
                                                token: newToken,
                                                exp_date: new Date(new Date().getTime() + 2 * 1000 * 60 * 60),
                                                cont_id: newAccountDetails.cont_id
                                            }
                                            
                                            dbConnection.collection("Tokens").insertOne(newTokenRow, function (error, success) {
                                                if (error) {
                                                    throw error;
                                                    
                                                }
                                                console.log("Insrted");
                                                
                                            });


                                            // renderHTML("createdAccount.html",response);
                                            /**/
                                            sendRegistrationMail(formData.email, formData.username, "test", success);
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
                                        }

                                    });
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