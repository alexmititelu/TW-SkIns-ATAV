var url = require('url');
var fs = require('fs');
var qs = require('qs');
const MongoClient = require('mongodb').MongoClient;

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

        const secret = 'asdkasnd@#@#das';

        if (request.method === "GET") {
            if (path === "/getSubscribedCourses") {
                MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                        connection.close();
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");

                    var token = cookies.get('userToken');
                    var userData = jwt.verify(token,secret);
                    var email = JSON.stringify({email : userData.email});
                    //cookie !

                    //var emailData = {email : "mititelu.alex@yahoo.com"};

                    dbConnection.collection('Conturi').find(emailData).toArray(function (queryError, queryResult) {

                        if (queryError) {
                            throw queryError;
                            connection.close();
                        }
                        console.log(queryResult.length);
                        if (queryResult.length >= 1000){ //o sa fie != 1, se presupune ca emailul e UNIC
                            response.writeHead(418);
                            response.end("ERROR : multiple emails");
                            connection.close();
                        }
                        else{
                            var userId = queryResult[0]._id;
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
                        }
                    });

                });
            }
            else {
                response.writeHead(404);
                response.end("Path not found.");
            }
        }
        else if (request.method === "POST"){
            if (path === "/subscribe"){
                MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                        connection.close();
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");

                    //var token = cookies.get('userToken');
                    //var userData = JSON.parse(jwt.verify(token,secret));
                    //var email = {email : userData.email};
                    //cookie + fetch pe cont_id !

                    var contId = "5b16b59065136feeb6a37b1a";
                    
                    //iau asta din REQUEST !
                    var course;
                    collectRequestData(request,courseData => {
                        
                        console.log(courseData);
                        course = courseData._id;
                        
                        //var course = "DOAR PENTRU TEST: STERGE DIN DB !";

                        var newSubscription = {
                            cont_id : contId,
                            curs_id : course
                        };

                        dbConnection.collection("Abonati").insertOne(newSubscription, function(error, success) {
                            if (error) {
                                throw error;

                            }
                            console.log("Inserat");
                            response.writeHead(200);
                            response.end("Succesfully inserted !");
                            connection.close();
                        });
                    });
                });
            }
            else {
                response.writeHead(404);
                response.end("Path not found.");
            }
        }
        else {
            response.writeHead(404);
            response.end("Bad request.");
        }
    }
}