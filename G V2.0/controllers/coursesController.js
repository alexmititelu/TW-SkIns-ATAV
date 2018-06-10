var qs = require('querystring');

var pathElements = __dirname.split("/");
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join("/");


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

module.export = coursesHandler = function(req, res, cookies, axios, fs, qs)
{	
	

	if(req.url === '/courses' && req.method === 'GET')
	{
		var cookie = cookies.get('userToken');

		if(!cookie)
		{
			var url = 'http://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
			const file = homePath + "/src/html/courses.html";

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

	if(req.url === '/postCourse' && req.method === 'POST')
	{
		


		collectRequestData(req, courseDetails => {
			
			axios.post('localhost:8051/postCourse', courseDetails)
			.then(function(response){

				response.setEncoding('utf8');

			    var body = '';

			    response.on('data', function(chunk) {
			        body += chunk;
			    });

				response.on('end', function(){

					body = JSON.parse(body);

					if( body.result === 'succes')
					{
						url = 'http://localhost:8050/index.html'
						res.writeHead(302, {Location: url});
						res.end();
					}
					else if( body.result === 'fail')
					{
						res.write(response)
						res.writeHead(200, {
	                    'Content-Type': 'text/html'
	            		});
	            		res.end();
					}
					else{

					}
				});
					
			})
			.catch(function(error){
				res.end(error.message);
			})
		})


		
	}

	if(req.url === '/getAllCourses' && req.method === 'GET')
	{
		


		
			
		axios.post('localhost:8051/postCourse', courseDetails)
		.then(function(response){

			response.setEncoding('utf8');

		    var body = '';

		    response.on('data', function(chunk) {
		        body += chunk;
		    });

			response.on('end', function(){

				body = JSON.parse(body);

				if( body.result === 'succes')
				{
					url = 'http://localhost:8050/index.html'
					res.writeHead(302, {Location: url});
					res.end();
				}
				else if( body.result === 'fail')
				{
					res.write(response)
					res.writeHead(200, {
                    'Content-Type': 'text/html'
            		});
            		res.end();
				}
				else{

				}
			});
				
		})
		.catch(function(error){
			res.end(error.message);
		})
		


		
	}
}