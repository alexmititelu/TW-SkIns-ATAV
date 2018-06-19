var https = require('http');
var qs = require('querystring');
var fs = require('fs');
var PythonShell = require('python-shell');
var formidable = require('formidable');
const MongoClient = require('mongodb').MongoClient;
var url = require('url');
var path = require('path');

function renderPythonPage(path, response) {
    fs.readFile(path, function (error, htmlContent) {
        if (error) {
            renderNotFoundHTML(response);
        } else {
            response.writeHead(200, { 'Content-Type': 'text/html' })
            response.write(htmlContent);
            response.end();
        }
        
    });
}


function renderScriptResultPage(objectResult, response) {
    /**
     * Legenda pt status codes:
     *  - 200, success
     *  - 500, internal error la server
     *  - 501, eroare la rularea fisierului pythone (poate de compilare)
     *  - 502, internal error la baza de date
     *  - 503, niciun rezultat asociat exercitiului ala
     */
    // response.writeHead(200, { 'Content-type': 'text/html' });
    // // response.write(results[0]);
    // response.end('<html><body bgcolor=\'#E6E6FA\'>' + JSON.stringify(jsonResult) + '</body></html>');
    switch(objectResult.status) {
        case 200:
            response.writeHead(200, { 'Content-type': 'text/html' });

            var finalMessage = '';

            if(objectResult.userScriptResult === objectResult.expectedScriptResult) {
                finalMessage = 'Congratulations!'
            } else {
                finalMessage = 'Don\'t give up! You can do it.'
            }

            var htmlResponse = '<html>'+
            '<style>' +
            ' p { color : #fff5c6 }' +
            ' h4 { color : #f2d013 }' +
            '</style>' +
            '<body bgcolor=\'#002156\'>' +
            '<h4> Input: </h4>' +
            '<p>' + objectResult.input + '</p>' +
            '<h4>Output:</h4>' +
            '<p>' + objectResult.userScriptResult + '</p>' +
            '<h4>Expected Output: </h4>' +
            '<p>' + objectResult.expectedScriptResult + '</p>' +
            '<br>' +
            '</body>'+
            '</html>'
            response.write(htmlResponse);
            response.end();
            break;
        case 500:
            response.writeHead(500, { 'Content-type': 'text/html' });
            response.write('Internal error at server');
            response.end();
            break;
        default:
            response.writeHead(500, { 'Content-type': 'text/html' });
            response.write('Default error');
            response.end();
    }

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

var certOptions = {
    key: fs.readFileSync(path.resolve('./server.key')),
    cert: fs.readFileSync(path.resolve('./server.crt'))
}

var serverPort = 9000;
https.createServer( function (request, response) {
    console.log(request.url);

    if (request.method === 'GET') {
        if (request.url === '/python') {
            console.log("PYTHON");
            renderPythonPage("/pythoncourse.html", response);

            // response.writeHead(200, { 'Content-Type': 'text/html' });
            // response.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
            // response.write('<input type="file" name="filetoupload"><br>');
            // response.write('<input type="submit">');
            // response.write('</form>');
            // return response.end();


        } else if (request.url === '/python/documentation') {


            fs.readFile("./documentation.txt", 'utf8', function (error, data) {
                if (error) throw error;

                // console.log(data)

                var jsonData = {
                    content: data
                };
                console.log("-----------------------");
                console.log(jsonData);
                console.log("-----------------------");
                // console.log(JSON.stringify(jsonData));
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write(JSON.stringify(jsonData));
                response.end();

            });


        } else if (request.url === '/python/exercises') {

            renderPythonPage("/pythonexercises.html", response);

        }
        else if (request.url === '/python/getExercises') {


            var exercises = [];

            /** EXERCITIILE DIN BD */

            MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");
                    var collection = dbConnection.collection("Python_Exercises");

                    var query = {
                        nrExercitiu: { $gt: 0, $lt: 6 }
                    };

                    var cursor = collection.find(query);

                    cursor.forEach(
                        function (doc) {
                            // console.log(doc);

                            var exercise = {
                                nrExercitiu: doc.nrExercitiu,
                                enunt: doc.enunt
                            }

                            exercises.push(exercise);
                            // console.log(exercises);
                        },
                        function (err) {
                            // dbConnection.close();
                            console.log("error");
                            console.log(exercises);

                            var jsonData = {
                                content: exercises
                            };

                            // console.log(JSON.stringify(jsonData));
                            response.writeHead(200, { 'Content-Type': 'application/json' });
                            response.write(JSON.stringify(jsonData));
                            response.end();

                        }

                    );



                });


        } else if (request.url.startsWith('/python/getExercise/')) {

            var nrExercitiuCerut = request.url.split("/").pop();

            var exercises = [];

            /** EXERCITIILE DIN BD */

            MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");
                    var collection = dbConnection.collection("Python_Exercises");

                    var query = {
                        nrExercitiu: parseFloat(nrExercitiuCerut)
                    };

                    var cursor = collection.find(query);
                    var index = 0;
                    cursor.forEach(
                        function (doc) {
                            // console.log(doc);

                            var exercise = {
                                nrExercitiu: doc.nrExercitiu,
                                enunt: doc.enunt
                            }

                            exercises.push(exercise);
                            // console.log(exercises);
                        },
                        function (err) {
                            // dbConnection.close();
                            console.log("error");
                            console.log(exercises[0]);

                            var jsonData = {
                                data: exercises[0]
                            };

                            // console.log(JSON.stringify(jsonData));
                            response.writeHead(200, { 'Content-Type': 'application/json' });
                            response.write(JSON.stringify(jsonData));
                            response.end();

                        }

                    );



                });


        } else {

            var path = url.parse(request.url).pathname;

            if (path.includes(".css")) {
                fs.readFile("../../../src/assets/css/" + path, function (error, cssContent) {
                    if (error) {
                        response.writeHead(404);
                        response.write("Couldn't load CSS / not found");
                    } else {
                        response.writeHead(200, { 'Content-Type': 'text/css' })
                        response.write(cssContent);
                    }
                    response.end();
                });

            } else {

                renderNotFoundHTML(response);
            }
        }
    } else {
        if (request.method === "POST") {
            if (request.url === '/run-python-script') {
                var requestBody = '';
                request.on('data', function (data) {
                    requestBody += data;
                });

                request.on('end', function () {
                    var formData = qs.parse(requestBody);
                    console.log(formData);


                    fs.writeFile("./microserviciu-python/script.py", formData.script, function (err) {
                        if (err) {
                            return console.log(err);
                        }

                        console.log("The file was saved!");

                        PythonShell.run('./microserviciu-python/script.py', function (shellError, results) {
                            if (shellError) {
                                console.log(shellError);
                                response.writeHead(404, { 'content-type': 'text/html' });
                                response.end("Error at runtime");
                            } else {
                                console.log(results);

                                var jsonResult = {
                                    "result": results
                                };

                                console.log(jsonResult);
                                // jsonResult = JSON.parse(jsonResult);

                                response.writeHead(200, { 'Content-type': 'text/html' });
                                // response.write(results[0]);
                                response.end(JSON.stringify(jsonResult));
                            }
                        });

                    });



                });
            } else if (request.url == '/python/fileupload') {
                var form = new formidable.IncomingForm();
                // console.log(form);
                form.parse(request, function (error, fields, files) {
                    // console.log('----------\n' + fields  );
                    // console.log(fields.textFromForm +'\n-----------');
                    // console.log(fields.uploadedEx +'\n-----------');
                    // 
                    var nrExercitiuIncarcat = fields.uploadedEx;

                    var jsonResult = {
                        "input": '',
                        "userScriptResult": '',
                        "expectedScriptResult": '',
                        "message": '',
                        "status": 200
                    };

                    var oldpath = files.filetoupload.path;
                    var newpath = __dirname + '/uploaded-user-files/' + 'username2.py'; // de pus usernameu la fraer
                    fs.rename(oldpath, newpath, function (error) {
                        if (error) {
                            console.log(error);
                            jsonResult.message = 'Internal error';
                            jsonResult.status = 500;
                            renderScriptResultPage(jsonResult, response);
                            // throw error;
                        }

                        PythonShell.run('/./uploaded-user-files/username2.py', function (shellError, results) {
                            if (shellError) {
                                console.log(shellError);
                                // response.writeHead(404, { 'content-type': 'text/html' });
                                // response.end("Error at runtime");
                                jsonResult.message = 'Error at runtime';
                                jsonResult.status = 501;
                                renderScriptResultPage(jsonResult, response);
                            } else {

                                jsonResult.userScriptResult = results;

                                /** Acum verificam ce rezultat trebuia sa obtinem de la server */


                                MongoClient
                                    .connect('mongodb://localhost:27017', function (error, connection) {
                                        if (error) {
                                            jsonResult.expectedScriptResult = 'Internal error';
                                            jsonResult.status = 502;
                                            renderScriptResultPage(jsonResult,response);
                                            // throw error;
                                            console.log(error);
                                        } else {

                                            var dbConnection = connection.db("TW_PROJECT_SkIns");
                                            var collection = dbConnection.collection("Python_Exercises");

                                            var query = {
                                                nrExercitiu: parseFloat(nrExercitiuIncarcat)
                                            };

                                            var cursor = collection.find(query);
                                            var index = 0;
                                            cursor.forEach(
                                                function (doc) {
                                                    console.log(doc);
                                                    // console.log(doc.enunt);
                                                    jsonResult.input = doc.input;
                                                    jsonResult.expectedScriptResult = doc.rezultat;
                                                    index++;
                                                    // console.log(exercises);
                                                },
                                                function (err) {
                                                    // dbConnection.close();
                                                    console.log("error");
                                                    if (index === 0) {
                                                        jsonResult.message = 'Internal error';
                                                        jsonResult.status = 503;
                                                    }
                                                    renderScriptResultPage(jsonResult,response);
                                                    console.log('------------JSON UL FINAL --------------')
                                                    console.log(jsonResult);
                                                    console.log('------------JSON UL FINAL --------------')
                                                    // console.log(exercises[0]);

                                                    // var jsonData = {
                                                    //     data: exercises[0]
                                                    // };

                                                    // console.log(JSON.stringify(jsonData));
                                                    // response.writeHead(200, { 'Content-Type': 'application/json' });
                                                    // response.write(JSON.stringify(jsonData));
                                                    // response.end();

                                                }

                                            );

                                        }

                                    });

                                /** Am terminat si cu rezultatul de la server */

                                // response.writeHead(200, { 'Content-type': 'text/html' });
                                // // response.write(results[0]);
                                // response.end('<html><body bgcolor=\'#E6E6FA\'>' + JSON.stringify(jsonResult) + '</body></html>');
                            }
                        });

                        //   response.write('File uploaded and moved!');
                        //   response.end();
                    });
                });
            }
        }
    }


}).listen(serverPort);
console.log('Server running at localhost:' + serverPort);
