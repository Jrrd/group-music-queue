
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
  ;

/*

TODO:

Here we will have to start a queue and create a LocalQueuePlayer to read the queue and 
kick off requests to connected clients

*/

var app = express()
,	queuePlayer = new LocalQueuePlayer(new ObjectQueue(properties.QUEUE_MAX_SIZE))
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
		console.log('attempting to queue request: ', audioReq);
		queuePlayer.queueRequest(audioReq);
		res.send(204);
	}
	catch (queueErr) {
		res.send(400, queueErr.message || "Error queuing");
	}
	
	
	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Music Queue Server listening on port " + app.get('port'));
});
