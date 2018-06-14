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
            if (path === "/achievements") {
                
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
					console.log("Cautam in achievements");
					
					//var queryFindAch =  { id_cont: "5b16b59065136feeb6a37b1a" }; //AICI VIN COOKIEURILE
                    
					var cookieData = jwt.verify(cookie,secret);
					var queryFindAch = {id_cont: cookieData._id};
					
					dbConnection.collection("Achievements").find(queryFindAch).toArray( function (err, result) {

                        if (err) {
                            throw err;
                        }

                        // console.log("Din Achievements: " + result[0].id_curs + " " + result[0].id_achievement + " " + result[0].progres);
                        // console.log(JSON.stringify(result));
						
						
						var queryFindLogo =  { logo_path: "achievement.png" }; //AICI VIN COOKIEURILE
						/*var queryFindLogo = {id_cont: cookieData._id};
						*/
						dbConnection.collection("AchievementsLogos").find(queryFindLogo).toArray( function (err, result2) {

							if (err) {
								throw err;
							}

							console.log("Din AchievementsLogos: " + result2[0].logo_path);
							console.log(JSON.stringify(result2));
							
							var objectArr = [];
							var objectGet = {};
							for (i = 0; i < result.length; i++) { //sau result2.length ca au aceeasi lungime
								for (var key in result[i]) {                  
												
									var value = result[i][key];
									objectGet[key] = value;
								}
											
								for (var key in result2[i]) {                 
												
									var value = result2[i][key];
									objectGet[key] = value;
								}
								console.log(JSON.stringify(result[i]) + " " + JSON.stringify(result2[i]));
								objectArr.push(objectGet);
							}
							
							console.log("OBJECTGET: " + JSON.stringify(objectGet));
							console.log("OBJECTARR: " + JSON.stringify(objectArr));
							
							response.writeHead(200,{'Content-Type': 'application/json'});
                            response.write(JSON.stringify(objectArr));
                            console.log('22222222222222')
                            console.log(objectArr)
							response.end();
							connection.close();
                        });
						
                    });
                    
					
					/*var queryFindLogo =  { logo_path: "achievement.png" }; //AICI VIN COOKIEURILE
                    dbConnection.collection("AchievementsLogos").find(queryFindLogo).toArray( function (err, result) {

                        if (err) {
                            throw err;
                        }

                        console.log("Din AchievementsLogos: " + result[0].logo_path);
                        console.log(JSON.stringify(result));
						
						response.writeHead(200,{'Content-Type': 'application/json'});
                        response.write(JSON.stringify(result));
                        response.end();
                        connection.close();
                        });*/
                });
            }
        }
        else{
            response.writeHead(404, 'Resource Not Found', { 'Content-Type': 'text/html' });
            response.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
        }
    }
}