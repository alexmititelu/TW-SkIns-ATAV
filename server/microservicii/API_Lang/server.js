const http = require('http')
const fs = require('fs')
const qs = require('qs')
const url = require('url')
const MongoClient = require('mongodb').MongoClient;
const speech = require('@google-cloud/speech');
const translate = require('google-translate-api');


const hostname = '127.0.0.1';
const port = process.env.PORT || 9000;


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


const server = http.createServer( (req, res) => {

    console.log(req.url)
    console.log(req.method)
    console.log('------------------------')


    if(req.url === '/getLang' && req.method === 'GET')
    {
        res.writeHead(200, {'Content-type' : 'text/html'})

        var homePath = __dirname + "/index.html";
        
        let inputHtml = fs.createReadStream(homePath)

        inputHtml.on('open', function () {

            inputHtml.pipe(res);
        });

        inputHtml.on('error', function(err) {
            res.end(err.message);
        });
    }
    else {
        var path = url.parse(req.url).pathname;

        if (path.includes(".css")) {
            fs.readFile( '.' + path, function (error, cssContent) {
                if (error) {
                    res.writeHead(404);
                    res.write("Couldn't load CSS / not found");
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/css' })
                    res.write(cssContent);
                }
                res.end();
            });

        } else if(path.includes(".js"))
        {
            fs.readFile( __dirname + path, function (error, cssContent) {
                if (error) {
                    res.writeHead(404);
                    res.write("Couldn't load JS / not found");
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/javascript' })
                    res.write(cssContent);
                }
                res.end();
            });
        } 
    }

    if(req.url.includes('/getExercitiu?') && req.method === 'GET')
    {

        nrEx = req.url.split('?');
        nrEx = nrEx[1];
        nrEx = nrEx.substr(5,)
        console.log(nrEx)

                var query = {
                    'nrExercitiu' : Number(nrEx)
                };

                
                MongoClient
					.connect('mongodb://localhost:27017')
					.then( client => {
                        
                        
						var dbConnection = client.db("TW_PROJECT_SkIns");
                        dbConnection.collection("Lang_exercises")
                        .findOne(query)
                        .then( result => {
                            
                            
                            console.log(result.text);
                            

                           
                            res.writeHead(200, {'Content-type' : 'text/html'});
                            res.write(result.text);
                            res.end(console.log('am terminat'));
                            client.close();
                           
                            // client.close();
                            console.log('#############');
                        })
                        .catch(err => {
                            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
                            console.log(err.message)
                        });
            
                    })
                    .catch(err => {
                        console.log(err.message)
                    });
        
    }            
   

    

    if(req.url === '/postAudio' && req.method === 'POST')
    {
        collectRequestData(req, useraudio => {
            console.log(useraudio.content.substr(22,))

            const client = new speech.SpeechClient();

            const config = {
                encoding: 'OGG_OPUS',
                sampleRateHertz: 48000 ,
                languageCode: 'en-US',
              };
              const audio = {
                content: useraudio.content.substr(22,),
              };
              
              const request = {
                config: config,
                audio: audio,
              };

            client
            .recognize(request)
            .then(data => {
                const response = data[0];
                const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');
                console.log(`Transcription: `, transcription);
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
              
        }) 
    }

    if(req.url === '/postText' && req.method === 'POST')
    {
        collectRequestData(req, usertext => {

            

            console.log(usertext.message)
            console.log(usertext.nrEx)

            translate(usertext.message, {to: 'en'}).then(raspuns => {
                console.log(raspuns.text);

                MongoClient
					.connect('mongodb://localhost:27017')
					.then( client => {
                        
                        var query = {
                            'nrExercitiu' : Number(usertext.nrEx)
                        };
						var dbConnection = client.db("TW_PROJECT_SkIns");
                        dbConnection.collection("Lang_exercises")
                        .findOne(query)
                        .then( result => {
                            

                            console.log(result.text)
                            if(result.text === raspuns.text)
                            {
                                res.writeHead(200, {'Content-type' : 'text/html'});
                                res.write('Bravo! Traducerea este corecta.');
                                res.end();
                            }
                            else{
                                res.writeHead(200, {'Content-type' : 'text/html'});
                                res.write('Ati gresit traducerea :( try again?');
                                res.end();
                            }


                        })
                        .catch(err => {
                            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
                            console.log(err.message)
                        });
        
                    })
                    .catch(err => {
                        console.log(err.message)
                    });

            }).catch(err => {
                console.error(err);
            });
        })      
    }

       
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});