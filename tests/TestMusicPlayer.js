var http = require('http'),
	querystring = require('querystring'),
	MusicPlayer = require('../lib/server/lib/MusicPlayer.js');

var mp = new MusicPlayer();

function testPlayFile() {
	
	mp.playFile("./sample.mp3");
	
	setTimeout(function() {
		console.log('timeout');
		// pause after 4 secs
		mp.pause();
		
		setTimeout(function() {
			console.log('resume');
			
			// resume after another 4 secs
			mp.resume();
			
		}, 5000);
		
		
	}, 2000);

}
// testPlayFile();

function testPlayHttpStream() {
	http.get("http://localhost:2500/musicstream", function(res) {
		console.log("Got response: " + res.statusCode);
		
		mp.playHttpStream(res);
		
	})
	.on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}
// testPlayHttpStream();

function testAddingToQueue() {
	
	var postData = querystring.stringify({
			client : 'localhost',
			port : 2500,
			filepath : '/Users/jarrod/Music/iTunes/iTunes Music/AC_DC/Back In Black/01 Hells Bells.mp3'
			// filepath : '/git-personal/group-music-queue/tests/sample.mp3'
		}),
		options = {
			host : 'localhost',
			port : '3800',
			method : 'POST',
			path : '/add',
			headers: {
				// 'Content-Type': 'application/x-www-form-urlencoded',
				// 'Content-Length': postData.length
			}
		};
	
	var req = http.request(options, function(res) {
		if (res.statusCode === 204) {
			console.log('Successful addition to the queue');
		}
	}).on('error', function() {
		console.log('Bad Request.');
	});
	
	console.log('sending: ' + postData);
	req.end(postData);
	
}
testAddingToQueue();