var Indexer = require('../lib/shared/utils/Indexer'),
	http = require('http'),
	fs = require('fs');

var indexer = new Indexer("frank");

module.exports = { 
	
	indexFileCreateTest : function(){
		indexer.createFile("./top", ".");
	},	

	indexFileUpdateTest : function(){
		indexer.updateFile(".", "./song-index.json")
	},
	
	indexFileSendToServerTest : function() {
		var postData = fs.readFileSync("./song-index.json", 'utf8');
		var options = {
				host : 'localhost',
				port : '3800',
				method : 'POST',
				path : '/indexfile',
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
	}

};

module.exports.indexFileSendToServerTest();