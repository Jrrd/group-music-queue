
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, _ = require('underscore')
	, querystring = require('querystring')
	, properties = require('./properties')
	, LocalQueuePlayer = require('./lib/LocalQueuePlayer')
	, ObjectQueue = require('../shared/utils/ObjectQueue')
	, LocalIndexPool = require('./lib/LocalIndexPool')
	, logger = require('../shared/logging/Logger').getLogger('server')
	;

/*

TODO:

Here we will have to start a queue and create a LocalQueuePlayer to read the queue and 
kick off requests to connected clients

*/

var app = express()
,	queuePlayer = new LocalQueuePlayer(new ObjectQueue(properties.QUEUE_MAX_SIZE))
,	indexPool = new LocalIndexPool();
;

app.configure(function(){
  app.set('port', properties.QUEUE_PLAYER_PORT || process.env.PORT || 3000);
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


app.post('/add', function(req, res, next) {
	
	var audioReq = _.clone(req.body);

	try {
		logger.debug('attempting to queue request: ', audioReq);
		queuePlayer.queueRequest(audioReq);
		res.send(204);
	}
	catch (queueErr) {
		res.send(400, queueErr.message || "Error queuing");
		logger.error("Error queuing => " + queueErr.toString());
	}
	
	
	
});

app.all('/heartbeat', function(req, res, next) {

	logger.debug("heartbeat: ", req.body);
	res.send(200, "OK");

	next();

});

app.post('/indexfile', function(req, res) {
	
	var indexFile = _.clone(req.body);

	try {
		logger.debug('attempting to add index file to server: ', audioReq);
		indexPool.add(indexFile);
		res.send(204);
	}
	catch (indexError) {
		res.send(400, indexError.message || "Error storing index file");
	}
});

app.delete('/indexfile', function(req, res) {
	
	var clientID = req.body.clientID;

	try {
		logger.debug('attempting to remove index file to server: ', audioReq);
		indexPool.remove(clientID);
		res.send(204);
	}
	catch (indexError) {
		res.send(400, indexError.message || "Error removing index file");
	}
});

http.createServer(app).listen(app.get('port'), function(){
    logger.info("Music Queue Server listening on port " + app.get('port'));
});
