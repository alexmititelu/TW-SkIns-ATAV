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


module.export = profileHandler = function(req, res, axios, fs)
{	

	var cookies = new Cookies(req, res, null);
	
    if(req.method === 'GET' && req.url === '/getFields')
    {
        axios({
            method : 'get',
            url : 'http://127.0.0.1:8055/getFields',
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

    // if(req.method === 'POST' && req.url === '/post_course')
    // {
    //     collectRequestData(req, userDetails => {
			
	// 		console.log(userDetails)
	// 		axios({
	// 			method : 'post',
	// 			url : 'http://127.0.0.1:8051/register',
	// 			data : userDetails
	// 		})
	// 		.then(function(responsex){

	// 					res.write(responsex.data)
	// 					res.writeHead(200, {
	//                     'Content-Type': 'text/html'
	//             		});
	//             		res.end();
				
					
	// 		})
	// 		.catch(function(error){
	// 			res.end(error.message);
	// 		})
	// 	})
	// }
}