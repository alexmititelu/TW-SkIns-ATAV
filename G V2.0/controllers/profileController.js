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


module.export = profileHandler = function(req, res, axios, fs)
{	

	var cookies = new Cookies(req, res, null);
	
	
    if(req.method === 'GET' && req.url === '/getFields')
    {	
		var cookie = cookies.get('userToken');
		console.log("Getting FIelds ------")
		console.log("Cookie: " + cookie);
        axios({
            method : 'post',
			url : 'http://localhost:8055/getFields',
			data: {
				cookie: cookie
			  }
        })
        .then(function(responsex){

					console.log('##########################################################################')
					console.log(JSON.stringify( responsex.data))
					res.writeHead(200, {
						'Content-Type': 'text/html'
						});
					res.write(JSON.stringify( responsex.data))
                    
                    res.end();
            
                
        })
        .catch(function(error){
            res.end(error.message);
        })
    }

    if(req.method === 'GET' && req.url === '/Profile')
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
			const file = homePath + "/src/html/profile.html";

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


	if(req.url === '/my_profile' && req.method === 'POST')
	{

		var cookie = cookies.get('userToken');	
		collectRequestData(req, data => {

			
			console.log({
				cookie: cookie,
				data: data
			});
			axios(
				{
					method : 'post',
					url : 'http://127.0.0.1:8055/my_profile',
					data: {
						cookie: cookie,
						data: data
					}
				})
			.then(function(respondsex){
				
				
				console.log(respondsex.data)
				res.writeHead(200, {
					'Content-Type': 'text/html'
					});
				/*res.write(respondsex.data)
				res.end(console.log("gata"));*/
				var url = 'https://localhost:8050/Profile';

				res.writeHead(302, {Location: url});

				res.end();
				
					
			})
			.catch(function(error){
				res.end(error.message);
			})
		
		})
		
	}
}