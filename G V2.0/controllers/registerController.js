var qs = require('querystring');

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

module.export = registerHandler = function(req, res, cookies, axios, fs)
{	
	

	if(req.url === '/register' && req.method === 'GET')
	{
		var cookie = cookies.get('userToken');

		if(cookie)
		{
			var url = 'http://localhost:8050/index.html';

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
			var url = 'http://localhost:8050/index.html';

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

						res.write(responsex.data)
						res.writeHead(200, {
	                    'Content-Type': 'text/html'
	            		});
	            		res.end();
				
					
			})
			.catch(function(error){
				res.end(error.message);
			})
		})


		
	}
}