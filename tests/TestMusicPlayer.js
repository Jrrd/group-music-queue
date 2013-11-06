var http = require('http'),
	MusicPlayer = require('../lib/server/MusicPlayer.js');

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

testPlayHttpStream();
