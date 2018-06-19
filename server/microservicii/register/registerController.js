var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const MongoClient = require('mongodb').MongoClient;
var validator = require('validator');
var mySecret = "0ffiS416IDCkVfBV5L9U5W-lcc6IXtE7uaNo-Y1UJYCOEtMgv8DWLgHG_6AWJF1mQDVP74vL1VnoFKejwDz7bTQAOfaoTBtVBkvq03GfoIMZX6UvtL8m3N3bWk2g_J7wRbNHfS2AvLJmGlj7i7gdg8DX3uWP1BqX811x0O2dabX_1sR5hMKyxKLJtCCwAIqgkMXrmbj9b1RpB5utMdA9RaMP2Hp1tZWvnkX9beIPXjq8QM4rHQwsyi73zszwzXErQx6oAvq9NZxRTyJkd_mDUIp3rPNbvlXSB_W47jyHaQtPnkBq-HH2MKPC_kG02UJsQluHKH5GKzRsoPfAznAIMg";
const secondValidator = require('validate-data');
// const crypto = require('crypto');
const {SHA256} = require('crypto-js');
const registrationRules = {
    required: "email username password",
    email: "email",
    string: "email name username firstName lastName interests gender",
    number: "phone",
    isSubscribed: "boolean"
};

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
        subject: 'SkIns Account Registration',
        html: '<h1>Welcome ' + username + '</h1>' +
            '<p>In order to activate your account click on the following link: <br>https://localhost:8050/register/' + activationLink + '</p> ' +
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
    console.log(__dirname);
    fs.readFile(__dirname + "/../../../src/html/" + path, function (error, htmlContent) {
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


function renderNotFoundHTML(response) {
    console.log(__dirname);
    fs.readFile(__dirname + "/../../../src/html/pageNotFound.html", function (error, htmlContent) {
        
        if (error) {
            response.writeHead(404);
            
            response.write("Couldn't load HTML / not found");
        } else {
            console.log('ERROR');
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.write(htmlContent);
        }
        response.end();
    });
}


function validateFormData(form) {
    
    if(validator.isAlpha(form.username)=== false){
        return false;
    }

    if(validator.isAlpha(form.firstName)=== false){
        return false;
    }

    if(validator.isAlpha(form.lastName)=== false){
        return false;
    }
    
    if(validator.isDecimal(form.phone)=== false) {
        return false;
    }

    if(validator.isEmail(form.email)=== false){
        return false;
    }

    var lastValidation = secondValidator(form,registrationRules);
    console.log("Result of validation: " + lastValidation);
    
    if(lastValidation === false) {
        return false;
    }

    return true;
}

function sendJSON(objectResult, response) {

    response.writeHead(200, { 'Content-Type': 'application/json' });
    // response.write(JSON.stringify(queryResult));
    console.log(JSON.stringify(objectResult));    
    response.write(JSON.stringify(objectResult));
    response.end();
}

module.exports = {
    handleRequest: function (request, response) {

        var path = url.parse(request.url).pathname;

        if (request.method === "GET" && path.includes(".css") === false) {
            
            if (path === "/register") {
                renderHTML("createAccount.html", response);
            } else if (path.startsWith("/registerUsername=")) {
                
                var usernameToCheck = path.split("=", 2)[1].toLowerCase();
                
                
                var jsonResult = {
                    "status": 200,
                    "response": "valid"
                };

                MongoClient
                    .connect('mongodb://localhost:27017', function (error, connection) {
                        if (error) {
                            jsonResult.status = 500;
                            sendJSON(jsonResult, response);
                        } else {

                            var dbConnection = connection.db("TW_PROJECT_SkIns");

                            var query = { username: usernameToCheck };
                            dbConnection.collection("Conturi").find(query).toArray(function (queryError, queryResult) {

                                if (queryError) {
                                    // throw queryError;
                                    jsonResult.status = 500;

                                    sendJSON(jsonResult, response);

                                } else {

                                    if (queryResult.length === 0) {
                                        sendJSON(jsonResult, response);
                                    } else {
                                        jsonResult.response = "invalid";
                                        sendJSON(jsonResult, response);
                                    }
                                }
                            });
                        }
                    });

            } else if (path.startsWith("/register/") === true) {

                var tokenFromPath = path.split("/", 3)[2];

                MongoClient
                    .connect('mongodb://localhost:27017', function (error, connection) {
                        if (error) {
                            throw error;
                        }

                        var dbConnection = connection.db("TW_PROJECT_SkIns");

                        var query = { token: tokenFromPath };
                        dbConnection.collection("Tokens").find(query).toArray(function (queryError, queryResult) {

                            if (queryError) {
                                // throw queryError;
                                console.log('b')
                                response.writeHead(404);

                                response.write("Couldn't load HTML / not found");
                                response.end();
                                throw queryError;
                            }

                            if (queryResult.length === 1) {
                                response.writeHead(200, { 'Content-Type': 'text/html' })
                                response.write("<html><head></head><body><h2>Registration succesfull!</h2>" +
                                    "You'll be redirected to home page in " +
                                    "<span id=\"countdown\">5</span> seconds" +
                                    "<script type=\"text/javascript\">" +
                                    "   var seconds = 5;" +
                                    "   function countdown() {" +
                                    "      seconds = seconds - 1;" +
                                    "      if (seconds < 0) {" +
                                    "           window.location = \"localhost:8888/register\";" +
                                    "       } else {" +
                                    "           document.getElementById(\"countdown\").innerHTML = seconds;" +
                                    "           window.setTimeout(\"countdown()\", 1000);" +
                                    "        }" +
                                    "    }" +
                                    "countdown();" +
                                    "</script>" +
                                    "</body></html>");
                                response.end();
                                dbConnection.collection("Tokens").remove(query);
                            } else {
                                response.writeHead(404);
                                response.write("Couldn't load HTML / not found");
                                response.end();
                            }

                        });
                    });


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
                    var formData = JSON.parse(requestBody);

                    var valid = validateFormData(formData);

                    if(valid===true) {
                    console.log(formData)
                    MongoClient
                        .connect('mongodb://localhost:27017', function (error, connection) {
                            if (error) {
                                throw error;
                            }


                            var dbConnection = connection.db("TW_PROJECT_SkIns");
                            var newAccount = {
                                username: formData.username.toLowerCase(),
                                password: SHA256(formData.password + mySecret).toString(),
                                email: formData.email.toLowerCase()
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

                                    var conturi = dbConnection.collection("Tokens").find(query).toArray(function (queryError, queryResult) {

                                        if (queryError) {
                                            throw queryError;
                                        }

                                        if (!(queryResult.length === 0)) {
                                            newToken = randomstring.generate(64);
                                        } else {


                                            var newTokenRow = {
                                                token: newToken,
                                                createdAt: new Date().toISOString(),
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
                                            sendRegistrationMail(formData.email, formData.username, newTokenRow.token, success);
                                            // response.writeHead(200, { 'Content-Type': 'text/html' });
                                            // response.write("Thanks");
                                            // response.end();


                                            response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8', 'Transfer-Encoding': 'chunked' });
                                            response.write('succes')
                                            response.end();


                                            /**/
                                        }

                                    });
                                });
                            });
                        });
                    } else {
                        renderNotFoundHTML(response);
                    }
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