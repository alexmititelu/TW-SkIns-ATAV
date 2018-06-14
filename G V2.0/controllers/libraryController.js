var qs = require('querystring');
var Cookies = require('cookies');
var pathResolver = require('path');


var pathElements = __dirname.split(pathResolver.sep);
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join(pathResolver.sep);


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

module.export = libraryHandler = function(req, res, axios, fs)
{	
	
	var cookies = new Cookies(req, res, null);
	var cookie = cookies.get('userToken');

	
	if(req.url === '/myLibrary' && req.method === 'GET')
	{
		

		if(!cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
			const file = homePath + "/src/html/library.html";

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

	if(req.url === '/getSubscribedCourses' && req.method === 'GET')
	{

			

		axios(
			{
				method : 'post',
				url : 'http://127.0.0.1:8053/getSubscribedCourses',
				data: {
					cookie: cookie
				  }
			})
		.then(function(respondsex){

			console.log(respondsex)
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Access-Control-Allow-Origin': 'https://localhost:8050',
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
				});
			res.write(JSON.stringify( respondsex.data) )
			res.end();
			
				
		})
		.catch(function(error){
			res.end(error.message);
		})
		


		
	}

	if(req.url === '/subscribe' && req.method === 'POST')
	{

		var cookie = cookies.get('userToken');	
		console.log("TEST COOKIE : " + cookie);
		collectRequestData(req, data => {

			
			console.log({
				cookie: cookie,
				data: data
			});
			axios(
				{
					method : 'post',
					url : 'http://127.0.0.1:8053/subscribe',
					data: {
						cookie: cookie,
						cid: data
					}
				})
			.then(function(respondsex){
				
				
				console.log(respondsex.data)
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Access-Control-Allow-Origin': 'https://localhost:8050',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
					});
				res.write(respondsex.data)
				res.end(console.log("gata"));
				
					
			})
			.catch(function(error){
				res.end(error.message);
			})
		
		})
		
	}
}