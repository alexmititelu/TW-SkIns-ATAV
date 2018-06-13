var url = require('url');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const mongo = require('mongodb');

module.exports = {
    handleRequest: function(request, response){

        let secret = fs.readFileSync('./../../../secret.txt');

        var path = url.parse(request.url).pathname;
        console.log("Path: " + path);
        if (request.method === "POST" && path.includes(".css") === false) {
            if (path === "/testimoniale") {
                
                var body = "";
                var jsonObj;
                var cookie;
                request.on('data', function (chunk) {
                  body += chunk;
                });
                request.on('end', function () {
                  
                  jsonObj = body;
                    
                cookie = jsonObj;
                })
                
                
                
                MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                        connection.close();
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");
					console.log("Cautam in testimoniale");
					
					// var queryFindTest =  { id_cont: "5b16b59065136feeb6a37b1a" }; //AICI VIN COOKIEURILE
                   
                    
                    var cookieData = jwt.verify(cookie,secret);
                    
					var queryFindTest = {id_cont: new mongo.ObjectID(cookieData._id)};
					
					dbConnection.collection("Testimoniale").find(queryFindTest).toArray( function (err, result) {

                        if (err) {
                            throw err;
                        }

                        // console.log("Din Testimoniale: " + result[0].id_cont + " " + result[0].id_curs + " " + result[0].feedback);
                        // console.log(JSON.stringify(result));
						
						response.writeHead(200,{'Content-Type': 'application/json'});
                        response.write(JSON.stringify(result)); //result e array de jsonuri
                        response.end();
                        connection.close();
                        });
                    
                })
            }
        }
        else{
            response.writeHead(404, 'Resource Not Found', { 'Content-Type': 'text/html' });
            response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
        }
    }
}