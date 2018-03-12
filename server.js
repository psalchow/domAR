var express = require('express');
var http = require('http');

const commandServer = require('./serverSrc/slidAR/commandServer');


function startServer() {
    const wsPort = process.argv[4] || 2337;
    const httpPort = process.argv[3] || 2338;
    const folder = process.argv[2] || 'build';

    const app = express();
    app.use('/', express.static(__dirname + '/' + folder));

    http.createServer(app).listen(httpPort);

    console.log(`serving folder '${folder}' on port: ${httpPort}`);

    commandServer.startNew(wsPort);
}

startServer();