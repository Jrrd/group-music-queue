var Indexer = require('../lib/shared/utils/Indexer'),
	http = require('http'),
	fs = require('fs');

var indexer = new Indexer();

module.exports = { 
	
	indexFileCreateTest : function(){
		indexer.createFile("./medium", ".");
	},	

	indexFileUpdateTest : function(){
		indexer.updateFile("./top", "./song-index.json")
	},
	
	indexFileSendToServerTest : function() {
		var postData = fs.readFileSync("./song-index.json", 'utf8');
		var options = {
				host : 'localhost',
				port : '3800',
				method : 'POST',
				path : '/indexfile/frank',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(postData)				
				}
			};
		
		var req = http.request(options, function(res) {
			if (res.statusCode === 204) {
				console.log('Successful addition to the index pool!');
			}
		}).on('error', function() {
			console.log('Bad Request.');
		});
		
		console.log('sending: ' + postData);
		req.end(postData);	
	},
	
	indexFileRemoveFromServerTest : function() {
		this.indexFileSendToServerTest();
		setTimeout(function(){
			var options = {
				host : 'localhost',
				port : '3800',
				method : 'DELETE',
				path : '/indexfile/frank',
				headers: {}
			};
		
		var req = http.request(options, function(res) {
			if (res.statusCode === 204) {
				console.log('Successful deletion from the index pool!');
			}
			process.exit(0);
		}).on('error', function() {
			console.log('Bad Request.');
			process.exit(1);
		});
		
		console.log('sending...');
		req.end();	}, 5000)	
	},
	
	retrieveSingleSongListFromServer : function() {
		this.indexFileSendToServerTest();
		setTimeout(function(){
			var options = {
				host : 'localhost',
				port : '3800',
				method : 'GET',
				path : '/indexfile/frank',
				headers: {}
			};
		
		var req = http.request(options, function(res) {
			res.on("data", function(chunk) {
			    console.log("BODY: " + chunk);
				process.exit(0)
			  });
		}).on('error', function() {
			console.log('Bad Request.');
			process.exit(1);
		});
		
		console.log('sending...');
		req.end();	}, 5000)
		
	},
	
	retrieveAllSongsFromServer : function() {
			this.indexFileSendToServerTest();
			setTimeout(function(){
				var options = {
					host : 'localhost',
					port : '3800',
					method : 'GET',
					path : '/indexfile/',
					headers: {}
				};
		
			var req = http.request(options, function(res) {
				res.on("data", function(chunk) {
				    console.log("BODY: " + chunk);
					process.exit(0)
				  });
			}).on('error', function() {
				console.log('Bad Request.');
				process.exit(1);
			});
		
			console.log('sending...');
			req.end();	}, 5000)
		
		}

};

module.exports.indexFileSendToServerTest();