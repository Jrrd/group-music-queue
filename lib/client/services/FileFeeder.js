var http = require('http'), 
	fs = require('fs'), 
	path = require('path'),
	util = require('util'),
	logger = require('../../shared/logging/Logger').getLogger('client');

var FileFeeder = function(port) {
	
	port = port || 3000;
	
	var instance = this;
	
	instance.startServer = function() {
		
		http.createServer(function(request, response) {
			var url = request.url;
			
			// requesting stream
			if (/\/musicstream/.test(url)) {
				
				logger.debug('stream requested');
				// TODO: pull request data that includes which file to play 
				
				var localFilePath = 'tests/sample.mp3';
				var stat = fs.statSync(localFilePath);
				
				
				response.on('close', function() {
					logger.info('\n+++client connection was terminated');
				});
				
				response.writeHead(200, {
					'Content-Type' : 'audio/mpeg',
					'Content-Length' : stat.size
				});
				var readStream = fs.createReadStream(localFilePath);
				
				openStream(readStream, response);
				
			} 
			else {
				response.statusCode = 404;
				response.end('Bad Request');
			}
			
		}).listen(port);
		
		logger.info('File Feeder started on port: ' + port);
		
	};
	
	return instance;
	
};

FileFeeder.prototype.pipeStreamer = function(readStream, writeStream) {
	
	logger.debug('streaming data...\n');
	
	readStream
	.on('data', function(data) {
		if (!writeStream.write(data)) {
			// logger.info('pause reading');
			process.stdout.write(" | ");
			readStream.pause();
		}
	})
	.on('end', function() {
		logger.debug('\nreading is complete');
		writeStream.end();
	});
	
	writeStream
	.on('drain', function() {
		// logger.info('resume reading');
		process.stdout.write('>');
		readStream.resume();
	})
	.on('finish', function() {
		logger.debug('\nwriting has finished');
	});
			
	
};


module.exports = FileFeeder;
