var qs = require('querystring');
var Cookies = require('cookies');

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

module.export = achievementHandler = function(req, res, axios, fs)
{	
	var cookies = new Cookies(req, res, null);
	
	if(req.url === '/src/html/achievements.html' && req.method === 'GET')
	{
		var cookie = cookies.get('userToken');

		if(!cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
			const file = __dirname + '/../..' + '/src/html/achievements.html';

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

	var cookie = cookies.get('userToken');
	if(req.url === '/achievements' && req.method === 'GET')
	{

			

		axios({
			method : 'post',
			url : 'http://127.0.0.1:8052/achievements',
			data: cookie
		})
		.then(function(respondsex){

			
			
			var body = JSON.stringify(respondsex.data)
			console.log(body)
				

					res.writeHead(200, {
                    'Content-Type': 'application/json'
            		});
					res.write(body);
					res.end();

				
		})
		.catch(function(error){
			res.end(error.message);
		})
		


		
	}
}