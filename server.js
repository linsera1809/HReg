'use strict';

//Load required modules
require('dotenv').config();
var logger = require('./server/config/logger');
var app = require('./server/app');
var https = require('https');
var fs = require('fs');

//Get port from environment
var port = normalizePort(process.env.HTTPS_PORT || '3443');

//Create HTTPS server.
var credentials = {
  pfx: fs.readFileSync('./server/ssl/fancy.nwie.net.pfx'),
  passphrase: 'nVyxMyv9'
};
var httpsServer = https.createServer(credentials, app);

//Listen on provided port, on all network interfaces.
httpsServer.listen(port);
httpsServer.on('error', onHttpsError);
httpsServer.on('listening', onHttpsListening);

//Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

//Event listener for HTTPS server "error" event.
function onHttpsError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  //Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//Event listener for HTTPS server "listening" event.
function onHttpsListening() {
  var addr = httpsServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.info('HTTPS Server Started ' + new Date(Date.now()).toString());
  logger.info('Listening on ' + bind);
}
