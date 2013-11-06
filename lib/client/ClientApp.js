/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , FileFeeder = require('./services/FileFeeder')
  , properties = require('./properties')
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

app.get('/musicstream', function(req, res, next) {
	
	console.log('stream requested');
	// TODO: pull request data that includes which file to play 
	
	var localFilePath = '../../tests/sample.mp3';
	var stat = fs.statSync(localFilePath);
	
	
	res.on('close', function() {
		console.log('\n+++client connection was terminated');
	});
	
	res.writeHead(200, {
		'Content-Type' : 'audio/mpeg',
		'Content-Length' : stat.size
	});
	var readStream = fs.createReadStream(localFilePath);
	
	fileFeeder.pipeStreamer(readStream, res);
	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Client streamer listening on port " + app.get('port'));
});
