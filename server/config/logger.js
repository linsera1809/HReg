'use strict';

var winston = require('winston');
require('winston-daily-rotate-file');
var fs = require('fs');
var dir = './logs';

//Create logs directory if it doesn't exist
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

//Configure winston logger
var config = winston.config;
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  colorize: true,
  level: (process.env.LOG_LEVEL || 'silly'),
  timestamp: function() {
    return new Date().toString();
  },
  formatter: function(options) {
    return config.colorize(options.level, 'HackathonRegistration' + ' ' + options.level) + ' ' +
      (options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
  }
});
winston.add(winston.transports.DailyRotateFile, {
  name: 'info-file',
  filename: './logs/-info.log',
  datePattern: 'yyyy-MM-dd',
  prepend: true,
  maxDays: 30,
  level: 'info',
  timestamp: function() {
    return new Date().toString();
  },
  formatter: function(options) {
    return options.timestamp() + ' ' +
      config.colorize(options.level, options.level) + ' ' +
      (options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
  }
});
winston.add(winston.transports.DailyRotateFile, {
  name: 'error-file',
  filename: './logs/-error.log',
  datePattern: 'yyyy-MM-dd',
  prepend: true,
  maxDays: 30,
  level: 'error',
  timestamp: function() {
    return new Date().toString();
  },
  formatter: function(options) {
    return options.timestamp() + ' ' +
      config.colorize(options.level, options.level) + ' ' +
      (options.message ? options.message : '') +
      (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
  }
});

module.exports = winston;
