var qs = require('querystring');
var Cookies = require('cookies');
var pathResolver = require('path');
var randomstring = require("randomstring");
var PythonShell = require('python-shell');
var formidable = require('formidable');
const MongoClient = require('mongodb').MongoClient;

var pathElements = __dirname.split(pathResolver.sep);
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join(pathResolver.sep);
            

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
    if(objectResult.status===200) {
        
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
            '<h4>' + finalMessage + '</h4>' +
            '</body>'+
            '</html>'
            response.write(htmlResponse);
            response.end();
	} else {
        
            response.writeHead(500, { 'Content-type': 'text/html' });
            response.write('Internal error at server');
            response.end();
	}
		

}



function renderNotFoundHTML(response) {
    console.log(__dirname);
    fs.readFile(__dirname + "/../../src/html/pageNotFound.html", function (error, htmlContent) {
        
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

module.export = pythonCourseHandler = function(req, res, axios, fs)
{	
	
    var cookies = new Cookies(req, res, null);
    
    var foundPath = false;

	if(req.url === '/python' && req.method === 'GET')
	{
        foundPath = true;
		var cookie = cookies.get('userToken');
		console.log(cookie)
		

		if(!cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
			const file = homePath + "/src/html/pythonCourse.html";
			
			var readStream = fs.createReadStream(file);

			readStream.on('open', function () {

				readStream.pipe(res);
			});

			readStream.on('error', function(err) {
				res.end(err.message);
			});

			res.writeHead(200, {
                    'Content-Type': 'text/html'
            });
		}	
    }
    


	if(req.url === '/python/exercises' && req.method === 'GET')
	{
        foundPath = true;
		var cookie = cookies.get('userToken');
		console.log(cookie)
		

		if(!cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
			const file = homePath + "/src/html/pythonexercises.html";
			
			var readStream = fs.createReadStream(file);

			readStream.on('open', function () {

				readStream.pipe(res);
			});

			readStream.on('error', function(err) {
				res.end(err.message);
			});

			res.writeHead(200, {
                    'Content-Type': 'text/html'
            });
		}
    }


    if(req.url === '/python/documentation' && req.method === 'GET')
	{
        foundPath = true;
		var cookie = cookies.get('userToken');
		console.log(cookie)
		

		if(!cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
            // console.log(new Date());
			axios({
                method : 'GET',
                // "rejectUnauthorized": false, 
				url : 'http://127.0.0.1:9000/python/documentation'
			})
			.then(function(responsex){

                        console.log('--------------------');
                        // console.log(responsex)
                        // console.log(new Date());

                      

                        // if(jsonResponse.status !== 200) {
                        //     jsonResponse.statusText = 'Microserviciul a picat';
                        // }
						// res.write(responsex.data)
						// var jsonResponsex = JSON.parse(responsex);
						console.log("-----------------------");
						console.log(responsex.data.content);
						console.log("-----------------------");

						// jsonResponse = {
                        //     status : responsex.status,
                        //     statusText : responsex.statusText,
                        //     data : responsex.data.content
                        // }
						// console.log(responsex.content);
						// console.log("-----------------------");
                        res.writeHead(200, { 'Content-Type': 'application/json' });
						// res.write(JSON.stringify(jsonResponse));
						res.write(JSON.stringify(responsex.data.content));
                        res.end();
                   
            })
            .catch(err => {
                console.log("\n\n\n\n");
                console.log(err);
            })

		}	
	}



    if(req.url === '/python/getExercises' && req.method === 'GET')
	{
        foundPath = true;
		var cookie = cookies.get('userToken');
		console.log(cookie)
		

		if(!cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
            console.log(new Date());
			axios({
                method : 'GET',
                // "rejectUnauthorized": false, 
				url : 'http://127.0.0.1:9000/python/getExercises'
			})
			.then(function(responsex){

                        console.log('--------------------');
                        console.log(responsex)
                        console.log(new Date());

                        jsonResponse = {
                            status : responsex.status,
                            statusText : responsex.statusText,
                            data : responsex.data
                        }

                        if(jsonResponse.status !== 200) {
                            jsonResponse.statusText = 'Microserviciul a picat'
                        }
						// res.write(responsex.data)
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(responsex.data));
                        res.end();
                   
            })
            .catch(err => {
                console.log("\n\n\n\n");
                console.log(err);
            })

		}	
	}
    // request.url.startsWith('/python/getExercise/'
    
    if(req.url.startsWith('/python/getExercise/') && req.method === 'GET')
	{
        foundPath = true;
		var cookie = cookies.get('userToken');
		console.log(cookie)
		

		if(!cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
            console.log(new Date());
			axios({
                method : 'GET',
                // "rejectUnauthorized": false, 
				url : 'http://127.0.0.1:9000' + req.url
			})
			.then(function(responsex){

                        console.log('--------------------');
                        console.log(responsex)
                        console.log(new Date());

                        jsonResponse = {
                            status : responsex.status,
                            statusText : responsex.statusText,
                            data : responsex.data
                        }

                        if(jsonResponse.status !== 200) {
                            jsonResponse.statusText = 'Microserviciul a picat'
                        }
						// res.write(responsex.data)
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(responsex.data));
                        res.end();
                   
            })
            .catch(err => {
                console.log("\n\n\n\n");
                console.log(err);
            })

		}	
	}




	if(req.url === '/python/fileupload' && req.method === 'POST')
	{
		
		var form = new formidable.IncomingForm();
		// console.log(form);
		form.parse(req, function (error, fields, files) {
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
			var newFileName = randomstring.generate(50)+".py";
			var newpath = newFileName; 
			// var newpath = __dirname + "/../server/microservicii/python/uploaded-user-files/"+newFileName; // de pus usernameu la fraer
			fs.rename(oldpath,newpath, function (error) {
				if (error) {
					console.log(error);
					jsonResult.message = 'Internal error';
					jsonResult.status = 500;
					renderScriptResultPage(jsonResult, res);
					// throw error;
				}
				console.log("Director: " + __dirname);
				PythonShell.run("/./../"+newFileName, { scriptPath: __dirname },function (shellError, results) {
					if (shellError) {
						console.log("TEST");	
						console.log(shellError);
						// response.writeHead(404, { 'content-type': 'text/html' });
						// response.end("Error at runtime");
						jsonResult.message = 'Error at runtime';
						jsonResult.status = 501;
						renderScriptResultPage(jsonResult, res);
					} else {

						jsonResult.userScriptResult = results;

						/** Acum verificam ce rezultat trebuia sa obtinem de la server */


						MongoClient
							.connect('mongodb://localhost:27017', function (error, connection) {
								if (error) {
									jsonResult.expectedScriptResult = 'Internal error';
									jsonResult.status = 502;
									renderScriptResultPage(jsonResult,res);
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
											renderScriptResultPage(jsonResult,res);
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