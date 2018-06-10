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

module.export = achievementHandler = function(req, res, cookies, axios, fs, qs)
{	
	

	if(req.url === '/src/html/achievements.html' && req.method === 'GET')
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
			const file = __dirname + '/..' + '/src/html/achievements.html';

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

	if(req.url === '/getAllAchievements' && req.method === 'GET')
	{

			

		axios.get('localhost:8052/getAllAchievements')
		.then(function(res){

			this.res.setEncoding('utf8');

		    var body = '';

		    this.res.on('data', function(chunk) {
		        body += chunk;
		    });

			this.res.on('end', function(){

				

				if( body.result === 'succes')
				{
					body.pipe(res);
				}
				else if( body.result === 'fail')
				{
					res.write(body.result)
					res.writeHead(404, {
                    'Content-Type': 'text/html'
            		});
            		res.end();
				}

			});
				
		})
		.catch(function(error){
			res.end(error.message);
		})
		


		
	}
}