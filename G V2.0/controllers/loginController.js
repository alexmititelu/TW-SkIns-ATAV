	var qs = require('querystring');

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

module.export = loginHandler = function(req, res, cookies, validate, jwt, mongoClient)
{


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

									

									const secret = 'asdkasnd@#@#das';

									let user = {
										email : credentials.email,
										password : credentials.password
									}

									let token = jwt.sign(user,secret)

									var logged = {
										token : token,
										exp_date : new Date()
									};

									cookies.set('userToken', token, {
										maxAge: 1000 * 60 * 60 * 24
									});

									console.log(logged);
									dbConnection.collection("Tokens").insertOne(logged)
									.then( result => {
											console.log('@@@@@@@@@@@@@@@@@@@@@@@@')
											client.close();

											res.writeHead(302, {Location: 'http://localhost:8050/index.html'});

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