var http = require('http'), 
	fs = require('fs'), 
	path = require('path'),
	util = require('util');

var FileFeeder = function(port) {
	
	port = port || 3000;
	
	var instance = this;
	
	instance.start = function() {
		
		http.createServer(function(request, response) {
			var url = request.url;
			
			// requesting stream
			if (/\/musicstream/.test(url)) {
				
				console.log('stream requested');
				// TODO: pull request data that includes which file to play 
				
				var localFilePath = 'tests/sample.mp3';
				var stat = fs.statSync(localFilePath);
				
				
				response.on('close', function() {
					console.log('\n+++client connection was terminated');
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
		
		console.log('File Feeder started on port: ' + port);
		
	};
	
	var openStream = function(readStream, writeStream) {
		
		console.log('streaming data...\n');
		
		readStream
		.on('data', function(data) {
			if (!writeStream.write(data)) {
				// console.log('pause reading');
				process.stdout.write(" | ");
				readStream.pause();
			}
		})
		.on('end', function() {
			console.log('\nreading is complete');
			writeStream.end();
		});
		
		writeStream
		.on('drain', function() {
			// console.log('resume reading');
			process.stdout.write('>');
			readStream.resume();
		})
		.on('finish', function() {
			console.log('\nwriting has finished');
		});
				
		
	};
	
	return instance;
	
};

module.exports = FileFeeder;