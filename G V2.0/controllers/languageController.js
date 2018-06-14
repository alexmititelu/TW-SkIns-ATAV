const http = require('http')
const fs = require('fs')
const qs = require('qs')
const url = require('url')
var pathResolver = require('path');
var Cookies = require('cookies');

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


var pathElements = __dirname.split(pathResolver.sep);
pathElements.pop();
pathElements.pop();
var homePath = pathElements.join(pathResolver.sep);


module.export = languageHandler = function(req, res, axios, fs)
{	
	
    var cookies = new Cookies(req, res, null);
    
    var foundPath = false;

	if(req.url === '/language' && req.method === 'GET')
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
			const file = homePath + "/server/microservicii/API_Lang/index.html";
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
                            

                           
                            res.writeHead(200, {'Content-type' : 'text/html',
                            'Access-Control-Allow-Origin': 'https://localhost:8050',
                            'Access-Control-Allow-Credentials': 'true',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'});
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
}
