var qs = require('querystring');
var fs = require('fs');
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

module.export = loginHandler = function(req, res, validate, jwt, mongoClient)
{

	var cookies = new Cookies(req, res, null);
	
	if (req.url === '/signin' && req.method === 'POST') {
		collectRequestData(req, loginData => {

			
			delete loginData.remember;
			var credentials = loginData;
			
			

			if(validate({
				email : credentials.email,
				password : credentials.password
			}))
			{
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});

				res.end('error');
			}
			else
			{	
				
				mongoClient
					.connect('mongodb://localhost:27017')
					.then( client => {
							
						var dbConnection = client.db("TW_PROJECT_SkIns");
						dbConnection.collection("Conturi")
							.findOne(credentials)
							.then( result => {

									

									

									let user = {
										email : credentials.email,
										password : credentials.password
									}

									

									dbConnection.collection('Conturi').findOne(user)
									.then( result => {

											delete result.username;

											let secreteStream = fs.readFileSync('./../secret.txt');

											let token = jwt.sign(result,secreteStream)

											cookies.set('userToken', token, {
												maxAge: 1000 * 60 * 60 * 24
											});

											client.close();

											res.writeHead(302, {Location: 'https://localhost:8050/index.html'});

											res.end(console.log('http://localhost:8050/index.html') + '\n');

											

										
									})
									.catch(err => {
										console.log(err.message);
									})
					
							})
							.catch(err => {
								console.log(err.message);
							})
						
					})
					.catch(err =>{
						console.log(err.message);
					})
			}
		})
    }
}