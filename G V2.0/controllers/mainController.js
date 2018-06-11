
var pathElements = __dirname.split('\\');
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join('\\');



module.export = mainHandler = function(req, res, cookies, fs)
{	
	
    if(req.method === 'GET' && req.url === '/index.html')
    {   

        res.writeHead(200, {'Content-type' : 'text/html'})

        var pathElements = __dirname.split('\\');

        pathElements.pop();
        pathElements.pop();
        
        var homePath = pathElements.join("/") + "/index.html";
        
        let inputHtml = fs.createReadStream(homePath)

        inputHtml.on('open', function () {

            inputHtml.pipe(res);
        });

        inputHtml.on('error', function(err) {
            res.end(err.message);
        });

    }

    if (req.url === '/sign-out' && req.method === 'GET') {

        console.log('data  ' + new Date().toLocaleString());
        cookies.set('userToken', {maxAge: new Date()});
        cookies.set('userToken', {expires: new Date()});

        var url = 'https://localhost:8050/index.html';

        res.writeHead(302, {Location: url});

        res.end();
    
                
    }

	
}