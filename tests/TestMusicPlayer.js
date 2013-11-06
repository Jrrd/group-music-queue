var MusicPlayer = require('../lib/server/MusicPlayer.js');

var mp = new MusicPlayer();

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

