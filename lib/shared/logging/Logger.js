/**
 * Created with IntelliJ IDEA.
 * User: jarrod
 * Date: 11/18/13
 * Time: 12:19 AM
 */

var path = require("path")
,   winston = require("winston");

/*
var LoggerInstance = function(directory, name) {

	var logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)(),
			new (winston.transports.File)({ filename: path.join(directory, name + '.log')})
		]
	});

	return logger;
};

var singleton = null;
var Logger = function(directory) {

	if (!directory) {
		console.warn('No directory passed to Logger Module');
	}
	else {
		console.log('Initializing Logging Services. (Logs: ' + directory + ")");
	}

	var serverLog = new LoggerInstance(directory, 'server');
	var clientLog = new LoggerInstance(directory, 'client');


	singleton = {
		Server : serverLog,
		Client : clientLog
	}

}

Logger.prototype.getLoggers = function() {

	return singleton;

}
*/

var colors = {
	'detail':   'grey',
	'trace' :   'white',
	'debug' :   'blue',
	'enter' :   'inverse',
	'info'  :   'green',
	'warn'  :   'yellow',
	'error' :   'red'
};


var dir = path.join(__dirname, '../../../logs');

var serverTransportConfig = [
	new (winston.transports.Console)({
		colorize : true,
		// level : 'detail',
		silent : false
	}),
	new (winston.transports.File)({
		filename : path.join(dir, 'server.log'),
		// level : 'detail',
		silent : false,
		json : false
	})
];

var clientTransportConfig = [
	new (winston.transports.Console)({
		colorize : true,
		// level : 'detail',
		silent : false

	}),
	new (winston.transports.File)({
		filename : path.join(dir, 'client.log'),
		// level : 'detail'
		silent : false,
	})
];


// module.exports = Logger;
module.exports = {

	Server :    new (winston.Logger)({
					transports: serverTransportConfig
				}),

	Client :    new (winston.Logger)({
					transports: clientTransportConfig
				})

};

// module.exports.Server.addColors(colors);
// module.exports.Client.addColors(colors);
