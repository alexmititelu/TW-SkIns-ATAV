
var pathElements = __dirname.split('\\');
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join('\\');



module.export = mainHandler = function(req, res, cookies, axios, fs, qs)
{	
	
    if(req.method === 'GET' && req.url === '/index.html')
    {   

        res.writeHead(200, {'Content-type' : 'text/html'})

        var pathElements = __dirname.split('\\');

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

        cookies.set('userToken', {maxAge: Date.now()});
        cookies.set('testtoken', {expires: Date.now()});
                
    }

	
}