var qs = require('querystring');

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

module.export = registerHandler = function(req, res, cookies, axios, fs, qs)
{	
	

	if(req.url === '/src/html/createAccount.html' && req.method === 'GET')
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
			const file = __dirname + '/..' + req.url;

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

	if(req.url === '/src/html/createdAccount.html' && req.method === 'POST')
	{
		


		collectRequestData(req, userDetails => {
			

			axios.post('localhost:8051/src/html/createAccount.html', userDetails)
			.then(function(res){

				this.res.setEncoding('utf8');

			    var body = '';

			    this.res.on('data', function(chunk) {
			        body += chunk;
			    });

				this.res.on('end', function(){

					body = JSON.parse(body);

					if( body.result === 'succes')
					{
						url = 'http://localhost:8050/createdAccount.html'
						res.writeHead(302, {Location: url});
						res.end();
					}
					else if( body.result === 'fail')
					{
						res.write(this.res)
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
}