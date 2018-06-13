var url = require('url');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

module.exports = {
    handleRequest: function(request, response){
        var path = url.parse(request.url).pathname;
        console.log("Path: " + path);
        if (request.method === "GET") {
            if (path === "/getAllCourses") {
                MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                        connection.close();
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");
                    dbConnection.collection('Cursuri').find({}).toArray(function (queryError, queryResult) {

                        if (queryError) {
                            throw queryError;
                            connection.close();
                        }
                        console.log(JSON.stringify(queryResult));
                        
                        response.writeHead(200,
                            {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': 'https://localhost:8050',
                                'Access-Control-Allow-Credentials': 'true',
                                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
                            });
                        response.write(JSON.stringify(queryResult));
                        response.end();
                        connection.close();
                        console.log("Am trimis raspuns.");
                    });
                })
            }else {
                response.writeHead(404);
                response.end("Couldn't find the specified path.");
            }
        }
        else if (request.method === "POST"){
            if (path === "/postCourse"){
                MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                        connection.close();
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");

                    var courseData = {

                    };
                    connection.close();
                });
            }
            else{
                response.writeHead(404);
                response.end("Couldn't find the specified path.");
            }
        }
        else{
            response.writeHead(404, 'Resource Not Found', { 'Content-Type': 'text/html' });
            response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
        }
                }
}