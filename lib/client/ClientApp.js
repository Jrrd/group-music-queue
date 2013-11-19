/**
 * Module dependencies.
 */
var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, querystring = require('querystring')
	, fs = require('fs')
	, FileFeeder = require('./services/FileFeeder')
	, properties = require('./properties')
	, logger = require('../shared/logging/Logger').Client
	, _ = require('underscore')

	;

var app = express(),
	fileFeeder = new FileFeeder
	;

app.configure(function(){
  app.set('port', properties.FILE_FEEDER_PORT || process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app.get('/', routes.index);

app.all('/heartbeat', function(req, res, next) {
	
	logger.debug("heartbeat: ", req.body);
	res.send(200, "OK");
	
});


app.post('/musicstream', function(req, res, next) {

	logger.debug('stream requested');

	var audioReq = _.clone(req.body);
	
	if (audioReq.filepath) {

		res.on('close', function() {
			logger.info('\n+++client connection was terminated');
		});

		var localFilePath = audioReq.filepath;
		var stat = fs.statSync(localFilePath);
		
		res.writeHead(200, {
			'Content-Type' : 'audio/mpeg',
			'Content-Length' : stat.size
		});

		var readStream = fs.createReadStream(localFilePath);
		fileFeeder.pipeStreamer(readStream, res);
		
	}
	else {
		res.send(400, 'No filepath field set');
	}
		
});

http.createServer(app).listen(app.get('port'), function(){
	logger.info("Client streamer listening on port " + app.get('port'));
});
