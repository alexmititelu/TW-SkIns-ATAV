var url = require('url');
var fs = require('fs');
var qs = require('qs');
var Cookies = require('cookies');
const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';

    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(qs.parse(body));
        });
    }
    else {
        callback(null);
    }
}

module.exports = {
    handleRequest: function(request, response){
        var path = url.parse(request.url).pathname;
        console.log("Path: " + path);

        let secret = fs.readFileSync('./../../../secret.txt');
        


        if (request.method === "POST") {
            if (path === "/getSubscribedCourses") {

                var body = "";
                var jsonObj;
                var cookie;
                request.on('data', function (chunk) {
                  body += chunk;
                });
                request.on('end', function () {
                  
                  jsonObj = JSON.parse(body);
               
                cookie = jsonObj.cookie;
                })


                MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                        connection.close();
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");

                    
                    var userData = jwt.verify(cookie,secret);
                    var userId = new mongo.ObjectID(userData._id);
                    

                    //var emailData = {email : "mititelu.alex@yahoo.com"};

                    console.log("UserID : " + userId);
                    var coursesQuery = JSON.stringify({cont_id : userId});
                    console.log("Query : " + coursesQuery);

                    dbConnection.collection('Abonati').find(coursesQuery).toArray(function (queryError, queryResult) {

                        if (queryError) {
                            throw queryError;
                            connection.close();
                        }
                        var queryData = JSON.stringify(queryResult);
                        console.log("Query result : " + queryData);
                        var courseArr = [];

                        Object.keys(queryResult).forEach(function(courseObj){
                            var courseData = JSON.stringify(queryResult[courseObj]);
                            console.log("Course object data : " + courseData);
                            courseArr.push(queryResult[courseObj].curs_id);
                        });
                        console.log("Cursuri gasite : " + courseArr);
                            
                        var tempQuery = JSON.stringify({_id : {$in : courseArr}});
                        
                        dbConnection.collection('Cursuri').find(tempQuery).toArray(function (queryError, queryResult) {

                                if (queryError) {
                                    throw queryError;
                                    connection.close();
                                }
                                console.log("Cursuri cu detalii : " + JSON.stringify(queryResult));
                                response.writeHead(200,{'Content-Type': 'application/json'});
                                response.write(JSON.stringify(queryResult));
                                response.end();
                                connection.close();
                                console.log("Am trimis raspuns.");
                            });
                        });
                    });
            }
            
        
            if (path === "/subscribe"){

                console.log('#############################################')
                var course;

                var body = "";
                var jsonObj;
                var cookie;
                request.on('data', function (chunk) {
                  body += chunk;
                });
                request.on('end', function () {
                  
                  jsonObj = JSON.parse(body);
                     console.log('2222222222222222222222')
                    console.log(jsonObj)
                cookie = jsonObj.cookie;
                course = jsonObj.cid.cid;
                })


                MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                        connection.close();
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");

                    
                    var userData = jwt.verify(cookie,secret);
                    var contId = new mongo.ObjectID(userData._id);
                    //cookie

                    //var contId = "5b16b59065136feeb6a37b1a";
                    
                    //iau asta din REQUEST !
                    
                    // collectRequestData(request,courseData => {
                        
                        // console.log(courseData);
                        // course = courseData._id;
                        
                        //var course = "DOAR PENTRU TEST: STERGE DIN DB !";

                        var newSubscription = {
                            cont_id : contId,
                            curs_id : course
                        };

                        // console.log('2222222222222222222')
                        // console.log(newSubscription)


                        dbConnection.collection("Abonati").insertOne(newSubscription, function(error, success) {
                            if (error) {
                                throw error;

                            }
                            console.log("Inserat");
                            response.writeHead(200, {
                                'Content-Type': 'text/html'
                                });
                            response.write('Succesfully inserted !')
                            response.end();
                            
                            
                            connection.close();
                        })
                        .catch(error => {
                            console.log("Existent");
                            respnose.writeHead(418);
                            response.write('Already in database.');
                            response.end();
                        });
                    // });
                });
            }
            
        }
        else {
            response.writeHead(404);
            response.end("Bad request.");
        }
    }
}