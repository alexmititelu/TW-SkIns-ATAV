const http = require('http');
const https = require('https');
const fs = require('fs');
const mongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');

var axios = require('axios');


var Cookies = require('cookies');
var qs = require('querystring');

var crypto = require('crypto-js');
var validate = require("validate.js");
var moment = require('moment');



var mongoose = require('mongoose');

const loginController = require('./controllers/loginController');
const registerController = require('./controllers/registerController');

const assetsController = require('./controllers/assetsController');
// const mainController = require('./controllers/mainController');

const achievementController = require('./controllers/achievementController');
const libraryController = require('./controllers/libraryController');
// const profileController = require('./controllers/profileController');
const coursesController = require('./controllers/coursesController');

// const addOwnCourseController = require('./controllers/addOwnCourseController');


const hostname = '127.0.0.1';
const port = process.env.PORT || 8050;

// var options = {
//     key: fs.readFileSync( './localhost.key' ),
//     cert: fs.readFileSync( './localhost.cert' ),
//     requestCert: false,
//     rejectUnauthorized: false
// };

const server = http.createServer( (req, res) => {

    // console.log(req.url)
    // console.log(req.method)
    // console.log('------------------------')

    var cookies = new Cookies(req, res, null);

    assetsController.handleRequest(req, res);
    // mainController(req, res, cookies);

    registerHandler(req, res, cookies, axios, fs, qs);
    loginHandler(req, res, cookies, validate, jwt, mongoClient);

    achievementHandler(req, res, cookies, axios, fs, qs)
    libraryHandler(req, res, cookies, axios, fs, qs);
    // profileHandler(req, res, qs, cookies);
    coursesHandler(req, res, cookies, axios, fs, qs);

    // addOwnCourseHandler(req, res, qs, cookies);

    if(req.method === 'GET' && req.url === '/index.html')
        {   

            
            

            // interogat BD sa vad daca e logat sau nu ca sa vad ce ii afisez in menoul de sus

            res.writeHead(200, {'Content-type' : 'text/html'})
            var pathElements = __dirname.split("/");
            pathElements.pop();
            var homePath = pathElements.join("/") + "/index.html";
            console.log(homePath);
            let inputHtml = fs.createReadStream(homePath)

            inputHtml.pipe(res);
            // res.write('ala bala portocala')
            // res.end()
        }
       
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});