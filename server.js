var express = require('express');
var http = require('http');
var https = require('https');
var pem = require('pem');

const commandServer = require('./serverSrc/slidAR/commandServer');

const wsPort = process.argv[4] || 2337;
const httpPort = process.argv[3] || 2338;
const folder = process.argv[2] || 'build';

pem.createCertificate({ days:1, selfSigned:true }, function(err, keys) {
    // Create middleware for a static server
    var app = express();
    // app.all('*', (req, res, next) => {
    //     // always redirect to https
    //     if (req.secure) return next();
    //     res.redirect('https://' + req.hostname + ':' + httpsServer.address().port + req.url);
    // });
    app.use('/', express.static(__dirname + '/' + folder));

    // Create an HTTPS service
    var httpsServer = https.createServer({
        key: keys.serviceKey,
        cert: keys.certificate
    }, app).listen(0);

    // Create an http service
    http.createServer(app).listen(httpPort);

    commandServer.startNew(wsPort);

    console.log(`serving folder '${folder}' on port: ${httpPort}`);
});