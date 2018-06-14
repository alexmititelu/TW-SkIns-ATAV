var qs = require('querystring');
var Cookies = require('cookies');
var pathResolver = require('path');


var pathElements = __dirname.split(pathResolver.sep);
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join(pathResolver.sep);
const MongoClient = require('mongodb').MongoClient;


module.export = guitarCourseHandler = function(req, res, axios, fs)
{	
	
    var cookies = new Cookies(req, res, null);
    
    var foundPath = false;

	if(req.url === '/guitar' && req.method === 'GET')
	{
        foundPath = true;
		var cookie = cookies.get('userToken');
		console.log(cookie)
		

		if(!cookie)
		{
			var url = 'https://localhost:8050/index.html';

			res.writeHead(302, {Location: url});

			res.end();
		}
		else
		{
			const file = homePath + "/server/microservicii/guitar/index.html";
			console.log("@@@@@" + file);
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

    if (req.url === "/getTabs" && req.method === "GET"){
        
        axios(
        {
            method : 'get',
            url : 'http://localhost:9030',
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
}
