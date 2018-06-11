var url = require('url');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

module.exports = {
    handleRequest: function(request, response){
        var path = url.parse(request.url).pathname;
        console.log("Path: " + path);
        if (request.method === "GET" && path.includes(".css") === false) {
            if (path === "/testimoniale") {
                MongoClient
                .connect('mongodb://localhost:27017', function (error, connection) {
                    if (error) {
                        throw error;
                        connection.close();
                    }

                    var dbConnection = connection.db("TW_PROJECT_SkIns");
					console.log("Cautam in testimoniale");
					
					var queryFindTest =  { id_cont: "5b16b59065136feeb6a37b1a" }; //AICI VIN COOKIEURILE
                    dbConnection.collection("Testimoniale").find(queryFindTest).toArray( function (err, result) {

                        if (err) {
                            throw err;
                        }

                        console.log("Din Testimoniale: " + result[0].id_cont + " " + result[0].id_curs + " " + result[0].feedback);
                        console.log(JSON.stringify(result));
						
						response.writeHead(200,{'Content-Type': 'application/json'});
                        response.write("Array de JSONuri trimis inapoi cu testimonialele din bd: " + JSON.stringify(result)); //result e array de jsonuri
                        response.end();
                        connection.close();
                        });
                    
                })
            }else {
                response.writeHead(404);
                response.write("Couldn't load HTML / not found");
            }
        }
        else{
            response.writeHead(404, 'Resource Not Found', { 'Content-Type': 'text/html' });
            response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
        }
    }
}