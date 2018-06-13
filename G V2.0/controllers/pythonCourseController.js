var qs = require('querystring');
var Cookies = require('cookies');
var pathResolver = require('path');

var pathElements = __dirname.split(pathResolver.sep);
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join(pathResolver.sep);
            



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
		

		if(cookie)
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
		

		if(cookie)
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
		

		if(cookie)
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
				url : 'http://127.0.0.1:9000/python/documentation'
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
                            jsonResponse.statusText = 'Microserviciul a picat';
                        }
						// res.write(responsex.data)
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(jsonResponse));
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
		

		if(cookie)
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
		

		if(cookie)
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
		collectRequestData(req, uploadedFile => {
			
			console.log(userDetails)
			axios({
				method : 'post',
				url : 'http://127.0.0.1:9000/python/fileupload',
				data : uploadedFile
			})
			.then(function(responsex){


						console.log(responsex.data);
						// res.write(responsex.data)
						// res.writeHead(200, {
						// 'Content-Type': 'text/html; charset=UTF-8',
						// 'Transfer-Encoding': 'chunked'
	            		// });
                        
                        var fileUploadedResult = responsex.data;

                        if(responsex.status !== 200) {
                            fileUploadedResult.statusText = 'Microserviciul a picat'
                        }
						// res.write(responsex.data)
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(fileUploadedResult));
                        res.end();

					// if(responsex.data === 'succes')	
					// {
						
					// }
					// else{
					// 	res.writeHead(404);
					// 	res.write("Microserviciul register a picat");
					// 	res.end();
					// }

					
			})
			.catch(function(error){
				res.end(error.message);
			})
		})


		
	}
}