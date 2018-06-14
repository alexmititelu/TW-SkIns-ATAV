var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
var Cookies = require('cookies');
const mongo = require('mongodb');
// function renderHTML(path, res, fieldValue, fieldValue2, fieldValue3, fieldValue4, fieldValue5, fieldValue6, fieldValue7) {
//     fs.readFile("../src/html/" + path, function (err, data) {
//         if (err) {
//             res.writeHead(404);
//             res.write("Couldn't load HTML / not found");
//         } else {
//             data = data.toString().replace(/\{\{someVal\}\}/, fieldValue);
//             data = data.toString().replace(/\{\{someVal2\}\}/, fieldValue2);
//             data = data.toString().replace(/\{\{someVal3\}\}/, fieldValue3);
//             data = data.toString().replace(/\{\{someVal4\}\}/, fieldValue4);
//             data = data.toString().replace(/\{\{someVal5\}\}/, fieldValue5);
//             data = data.toString().replace(/\{\{someVal6\}\}/, fieldValue6);
//             data = data.toString().replace(/\{\{someVal7\}\}/, fieldValue7);

//             res.writeHead(200, { 'Content-Type': 'text/html' })
//             res.write(data);
//         }
//         res.end();
//     });
// }


module.exports = {
    handleRequest: function (req, res) {

        let secret = fs.readFileSync('./../../../secret.txt');
        var path = url.parse(req.url).pathname;
        console.log("Path: " + path);

        if (req.method === "POST" && path.includes(".css") === false) {
            if (path === "/getFields") {


                

                var body = "";
                var jsonObj;
                var cookie;
                req.on('data', function (chunk) {
                  body += chunk;
                });
                req.on('end', function () {
                  
                  jsonObj = JSON.parse(body);
               
                cookie = jsonObj.cookie;
                
                
                MongoClient
                        .connect('mongodb://localhost:27017', function (err, connection) {
                            if (err) {
                                throw err;
                            }

                            var dbConnection = connection.db("TW_PROJECT_SkIns");

                            console.log("Cautam sa vedem daca gasim in bd useru");

                            //var queryFindConturi = { username: "vladut" }; //AICI VIN COOKIEURILE DE MAI JOS
                            let secret = fs.readFileSync('./../../../secret.txt');
                            
                            
                            // console.log(cookie)
                            var cookieData = jwt.verify(cookie,secret);
                            
                            var o_id = new mongo.ObjectID(cookieData._id);
							var queryFindConturi = { _id : o_id };
							
                            dbConnection.collection("Conturi").findOne(queryFindConturi, function (err, result) {

                                if (err) {
                                    throw err;
                                }

                                console.log("Din conturi: " + result.username + " " + result.password + " " + result.email);

                                //var queryFindUtilizatori =  { last_name: "Mititelu" }; //AICI VIN COOKIEURILE DE MAI JOS
								
								var queryFindUtilizatori = {cont_id : o_id};
								console.log(queryFindUtilizatori)
                                dbConnection.collection("Utilizatori").findOne(queryFindUtilizatori, function (err, result2) {

                                        if (err) {
                                            throw err;
                                        }

                                        console.log("Din Utilizatori: " + result2.first_name + " " + result2.last_name + " " + result2.country + " " + result2.telefon);

										var objectGet = {};
										for (var key in result) {                  
											
											var value = result[key];
											objectGet[key] = value;
										}
										
										for (var key in result2) {                 
											
											var value = result2[key];
											objectGet[key] = value;
										}
									
										console.log(JSON.stringify(objectGet));
									
										res.writeHead(200,{'Content-Type': 'application/json'});
										res.write(JSON.stringify(objectGet));
										res.end();
                                    });

                            });

                        });
                    });
                        
            }
		
        }
         if (req.method === "POST") {
            console.log("Post method call");
            if (path === "/my_profile") {
                
                var body = "";
                var jsonObj;
                var cookie;
                var formData;

                
                req.on('data', function (chunk) {
                  body += chunk;
                  console.log('%%%%%%%%%%%%%%%%%%%%%%%%%')
                });
                req.on('end', function () {
                
                    console.log(body)
                  jsonObj = JSON.parse(body);

                    
                     console.log('2222222222222222222222')
                    console.log(jsonObj)

                cookie = jsonObj.cookie;
                formData = jsonObj.data;
                })
                
                    
                    MongoClient
                        .connect('mongodb://localhost:27017', function (err, connection) {
                            if (err) {
                                throw err;
                            }

                            var dbConnection = connection.db("TW_PROJECT_SkIns");

                            var searchTable = 'Utilizatori';
                            var objectUpdate = {};

                            for (var key in formData) {                 
                                if (key == 'username' || key == 'password' || key =='email')
                                    searchTable = 'Conturi';

                                var value = formData[key];
                                if (value != '') {
                                    objectUpdate[key] = value;
                                }
                            }
                            console.log("ASTA E NOUL OBIECT: " + JSON.stringify(objectUpdate));
                            
                            if(searchTable == 'Utilizatori') {

                                var userData = jwt.verify(cookie,secret);
                                var userId = new mongo.ObjectID(userData._id);

                                var queryUpdate = {cont_id: userId}; //AICI VIN COOKIEURILE
                                
                                dbConnection.collection("Utilizatori").updateOne(queryUpdate, { $set: objectUpdate }, function (err, success) {
                                    if (err) {
                                        throw err;
                                    }

                                    console.log("Am updatat informatiile unui user in UTILIZATORI");
                                });
                            }
                            else { //if searchTable = 'Conturi' (default)
                                var userData = jwt.verify(cookie,secret);
                                var userId = new mongo.ObjectID(userData._id);

                                var queryUpdate = {_id: userId}; //AICI VIN COOKIEURILE

                                dbConnection.collection("Conturi").updateOne(queryUpdate, { $set: objectUpdate }, function (err, success) {
                                    if (err) {
                                        throw err;
                                    }

                                    console.log("Am updatat informatiile unui user in CONTURI");
                                });
                            }

                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.write("Am primit datele si am facut modificarile in bd!");
                            res.end();

                            /*var queryFindConturi = { username: "vladut" }; //AICI VIN COOKIEURILE
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

                            });*/

                        });
                

            }
            else {
                res.writeHead(404, 'Resource Not Found', { 'Content-Type': 'text/html' });
                res.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
            }
        }
    }
}