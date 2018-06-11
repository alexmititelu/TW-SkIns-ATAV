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
const mainController = require('./controllers/mainController');

const achievementController = require('./controllers/achievementController');
const libraryController = require('./controllers/libraryController');
const profileController = require('./controllers/profileController');
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

var certOptions = {
    key: fs.readFileSync(path.resolve('./server.key')),
    cert: fs.readFileSync(path.resolve('./server.crt'))
  }

const server = https.createServer(certOptions, (req, res) => {

    console.log(req.url)
    console.log(req.method)
    console.log('------------------------')

    var cookies = new Cookies(req, res, null);

    assetsController.handleRequest(req, res);
    mainHandler(req, res, cookies, fs);

    registerHandler(req, res, cookies, axios, fs);
    loginHandler(req, res, cookies, validate, jwt, mongoClient);

    achievementHandler(req, res, cookies, axios, fs)
    libraryHandler(req, res, cookies, axios, fs);
    profileHandler(req, res, cookies, axios, fs);
    coursesHandler(req, res, cookies, axios, fs);

    // addOwnCourseHandler(req, res, qs, cookies);


       
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});