var qs = require('querystring');
var Cookies = require('cookies');

var pathElements = __dirname.split('\\');
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join('\\');
            


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

module.export = registerHandler = function(req, res, axios, fs)
{	
	
	var cookies = new Cookies(req, res, null);

	if(req.url === '/register' && req.method === 'GET')
	{
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
			const file = homePath + "/src/html/createAccount.html";
			console.log("***** FILE: " + file);
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


	if(req.url === '/createdAccount' && req.method === 'GET')
	{
		var cookie = cookies.get('userToken');

		if(cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
			const file = homePath + "/src/html/createdAccount.html";

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


	if(req.url === '/register' && req.method === 'POST')
	{
		collectRequestData(req, userDetails => {
			
			console.log(userDetails)
			axios({
				method : 'post',
				url : 'http://127.0.0.1:8051/register',
				data : userDetails
			})
			.then(function(responsex){


						console.log(responsex.data)
						// res.write(responsex.data)
						// res.writeHead(200, {
						// 'Content-Type': 'text/html; charset=UTF-8',
						// 'Transfer-Encoding': 'chunked'
	            		// });
						
					if(responsex.data === 'succes')	
					{
						fs.readFile(__dirname + "/../../src/html/createdAccount.html", function (error, htmlContent) {
							if (error) {
								res.writeHead(404);
								res.write("Couldn't load HTML / not found");
								res.end();
							} else {
								res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8','Transfer-Encoding': 'chunked' })
								res.write(htmlContent);
								res.end();
							}
						});
					}
					else{
						res.writeHead(404);
						res.write("Microserviciul register a picat");
						res.end();
					}

						
				
					
			})
			.catch(function(error){
				res.end(error.message);
			})
		})


		
	}
}