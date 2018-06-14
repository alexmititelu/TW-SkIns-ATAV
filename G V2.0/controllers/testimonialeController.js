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

module.export = testimonialeHandler = function(req, res, axios, fs)
{   
    var cookies = new Cookies(req, res, null);
    var cookie = cookies.get('userToken');

    if(req.url === '/testimoniale.html' && req.method === 'GET')
	{

			

		axios({
            method : 'post',
            url : 'http://127.0.0.1:8056/testimoniale',
            data:  cookie
                
        })
		.then(function(respondsex){


					res.writeHead(200, {
                    'Content-Type': 'application/json'
            		});
					res.write(JSON.stringify(respondsex.data));
					res.end();

				
		})
		.catch(function(error){
			res.end(error.message);
		})
		


		
	}
}