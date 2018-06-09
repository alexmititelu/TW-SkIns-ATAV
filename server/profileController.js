var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
const MongoClient = require('mongodb').MongoClient;

function renderHTML(path, res, fieldValue, fieldValue2, fieldValue3, fieldValue4, fieldValue5, fieldValue6, fieldValue7) {
    fs.readFile("../src/html/" + path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.write("Couldn't load HTML / not found");
        } else {
            data = data.toString().replace(/\{\{someVal\}\}/, fieldValue);
            data = data.toString().replace(/\{\{someVal2\}\}/, fieldValue2);
            data = data.toString().replace(/\{\{someVal3\}\}/, fieldValue3);
            data = data.toString().replace(/\{\{someVal4\}\}/, fieldValue4);
            data = data.toString().replace(/\{\{someVal5\}\}/, fieldValue5);
            data = data.toString().replace(/\{\{someVal6\}\}/, fieldValue6);
            data = data.toString().replace(/\{\{someVal7\}\}/, fieldValue7);

            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write(data);
        }
        res.end();
    });
}


module.exports = {
    handleRequest: function (req, res) {

        var path = url.parse(req.url).pathname;
        console.log("Path: " + path);

        if (req.method === "GET" && path.includes(".css") === false) {
            if (path === "/my_profile") {

                MongoClient
                        .connect('mongodb://localhost:27017', function (err, connection) {
                            if (err) {
                                throw err;
                            }

                            var dbConnection = connection.db("TW_PROJECT_SkIns");

                            console.log("Cautam sa vedem daca gasim in bd useru");

                            var queryFindConturi = { username: "vladut" }; //AICI VIN COOKIEURILE
                            dbConnection.collection("Conturi").findOne(queryFindConturi, function (err, result) {

                                if (err) {
                                    throw err;
                                }

                                console.log("Din conturi: " + result.username + " " + result.password + " " + result.email);
                        
                                var fieldValue = result.username;
                                var fieldValue2 = result.password;
                                var fieldValue3 = result.email;

                                var queryFindUtilizatori =  { last_name: "Mititelu" }; //AICI VIN COOKIEURILE
                                dbConnection.collection("Utilizatori").findOne(queryFindUtilizatori, function (err, result) {

                                        if (err) {
                                            throw err;
                                        }

                                        console.log("Din Utilizatori: " + result.first_name + " " + result.last_name + " " + result.country + " " + result.telefon);
                                
                                        var fieldValue4 = result.first_name;
                                        var fieldValue5 = result.last_name;
                                        var fieldValue6 = result.country;
                                        var fieldValue7 = result.telefon;

                                        renderHTML("profile.html", res, fieldValue, fieldValue2, fieldValue3, fieldValue4, fieldValue5, fieldValue6, fieldValue7);

                                    });

                            });

                            /*var queryFindUtilizatori =  { last_name: "Mititelu" }; //AICI VIN COOKIEURILE
                            dbConnection.collection("Utilizatori").findOne(queryFindUtilizatori, function (err, result) {

                                if (err) {
                                    throw err;
                                }

                                console.log(result.first_name + " " + result.last_name + " " + result.telefon);
                        
                                fieldValue4 = result.first_name;
                                fieldValue5 = result.last_name;
                                fieldValue6 = result.telefon;

                                renderHTML("profile.html", res, fieldValue, fieldValue2, fieldValue3);

                            });*/

                        });
                        
            }
            //} 
            /*else if (req.url.match("\.png$")) {
                var imagePath = path.join('./', 'src', req.url);
                var fileStream = fs.createReadStream(imagePath);
                res.writeHead(200, {"Content-Type" : "image/png"});
                fileStream.pipe(res);
            }*/
			else {
                res.writeHead(404);
                res.write("Couldn't load HTML / not found");
            }
        }
        else if (req.method === "POST") {
            console.log("Post method call");
            if (path === "/my_profile") {
                var reqBody = '';

                req.on('data', function (data) {
                    reqBody += data;
                });

                req.on('end', function () {
                    var formData = qs.parse(reqBody);
                    console.log(formData);

                    MongoClient
                        .connect('mongodb://localhost:27017', function (err, connection) {
                            if (err) {
                                throw err;
                            }

                            var dbConnection = connection.db("TW_PROJECT_SkIns");

                            var searchTable = 'Utilizatori';
                            var objectUpdate = {};

                            for (var key in formData) { //cream obietul cu campuri nenule pt update                   
                                if (key == 'username' || key == 'password' || key =='email')
                                    searchTable = 'Conturi';

                                var value = formData[key];
                                if (value != '') {
                                    objectUpdate[key] = value;
                                }
                                    //console.log(key + ", " + value);
                            }
                            console.log("ASTA E NOUL OBIECT: " + JSON.stringify(objectUpdate));
                            
                            if(searchTable == 'Utilizatori') {
                                var queryUpdate = {last_name: "Mititelu"}; //AICI VIN COOKIEURILE
                                
                                dbConnection.collection("Utilizatori").updateOne(queryUpdate, { $set: objectUpdate }, function (err, success) {
                                    if (err) {
                                        throw err;
                                    }

                                    console.log("Am updatat informatiile unui user in UTILIZATORI");
                                });
                            }
                            else { //if searchTable = 'Conturi' (default)
                                var queryUpdate = {username: "vladut"}; //AICI VIN COOKIEURILE

                                dbConnection.collection("Conturi").updateOne(queryUpdate, { $set: objectUpdate }, function (err, success) {
                                    if (err) {
                                        throw err;
                                    }

                                    console.log("Am updatat informatiile unui user in CONTURI");
                                });
                            }

                            /*res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.write("Am primit datele si am facut modificarile in bd!");
                            res.end();*/

                            var queryFindConturi = { username: "vladut" }; //AICI VIN COOKIEURILE
                            dbConnection.collection("Conturi").findOne(queryFindConturi, function (err, result) {

                                if (err) {
                                    throw err;
                                }

                                console.log("Din conturi: " + result.username + " " + result.password + " " + result.email);
                        
                                var fieldValue = result.username;
                                var fieldValue2 = result.password;
                                var fieldValue3 = result.email;

                                var queryFindUtilizatori =  { last_name: "Mititelu" }; //AICI VIN COOKIEURILE
                                dbConnection.collection("Utilizatori").findOne(queryFindUtilizatori, function (err, result) {

                                        if (err) {
                                            throw err;
                                        }

                                        console.log("Din Utilizatori: " + result.first_name + " " + result.last_name + " " + result.country + " " + result.telefon);
                                
                                        var fieldValue4 = result.first_name;
                                        var fieldValue5 = result.last_name;
                                        var fieldValue6 = result.country;
                                        var fieldValue7 = result.telefon;

                                        renderHTML("profile.html", res, fieldValue, fieldValue2, fieldValue3, fieldValue4, fieldValue5, fieldValue6, fieldValue7);

                                });

                            });

                        });
                });

            }
            else {
                res.writeHead(404, 'Resource Not Found', { 'Content-Type': 'text/html' });
                res.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
            }
        }
    }
}