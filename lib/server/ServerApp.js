var express = require('express'), 
	routes = require('./routes'), 
	http = require('http'), 
	path = require('path'), 
	_ = require('underscore'), 
	querystring = require('querystring'), 
	properties = require('./properties'), 
	LocalQueuePlayer = require('./lib/LocalQueuePlayer'), 
	ObjectQueue = require('../shared/utils/ObjectQueue'), 
	LocalIndexPool = require('./lib/LocalIndexPool');

/*

TODO:

Here we will have to start a queue and create a LocalQueuePlayer to read the queue and 
kick off requests to connected clients

*/

var app = express(),
	queuePlayer = new LocalQueuePlayer(new ObjectQueue(properties.QUEUE_MAX_SIZE)),	
	indexPool = new LocalIndexPool();

app.set('port', properties.QUEUE_PLAYER_PORT || process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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

// add index file into pool
app.post('/indexfile/:clientid', function(req, res) {	
	var clientid = req.params.clientid,
		indexFile = req.body;

	try {
		console.log('attempting to add index file to server for client', clientid);
		indexPool.add(clientid, indexFile);
		res.send(204);
	}
	catch (indexError) {
		res.send(400, indexError.message || "Error storing index file");
	}
});

// remove index file from pool
app.delete('/indexfile/:clientid', function(req, res) {
	var clientid = req.params.clientid

	try {
		console.log('attempting to remove index file from server for clientid', clientid);
		indexPool.remove(clientid);
		res.send(204);
	}
	catch (indexError) {
		res.send(400, indexError.message || "Error removing index file for client", clientid);
	}
});

// retrieve index file(s) from pool
app.get('/indexfile/:clientid', function(req, res) {
	var clientid = req.params.clientid

	try {
		console.log('attempting to retrieve index file for clientid', clientid);
		res.send(200, indexPool.retrieveSongs(clientid));
	}
	catch (indexError) {
		res.send(400, indexError.message || "Error removing index file");
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Music Queue Server listening on port " + app.get('port'));
});
