
var AudioRequestData = require('../../shared/dataobjects/AudioRequestData')
,	MusicPlayer = require('./MusicPlayer')
,	http = require('http')
,	querystring = require('querystring')
;

function LocalQueuePlayer(queue, playerOptions) {
	
	var instance = this,
		player = new MusicPlayer(); // this will be the player implementation object
	
	player.on('finish', function() {
		instance.playNext();
	});
	
	queue.on('item-new', function() {
		if (player.getStatus() !== player.STATUS.PLAYING) {
			instance.playNext();
		}
	});
	
	instance.playNext = function() {
		var audioReq = null;
		if (queue.getLength() > 0) {
			audioReq = new AudioRequestData(queue.getNext());
			if (audioReq.isValid()) {
				
				var options = {
					host: audioReq.client,
					port: audioReq.port,
					method: 'POST',
					path: '/musicstream'
				};
				
				var req = http.request(options, function(res) {
					console.log("Got response: " + res.statusCode);
					
					player.playHttpStream(res);
					
				})
				.on('error', function(e) {
					console.log("Got error: " + e.message);
				});
				
				
				var postData = querystring.stringify(audioReq);
				console.log('Server sending out for the following: ', postData);
				
				req.end(postData);
				
			}
		}
		else {
			console.log('No more songs in the queue');
		}
		
	};
	
	instance.reset = function() {
		
	};
	
	instance.queueRequest = function(audioRequestData) {
		
		var audioReq = new AudioRequestData(audioRequestData);
		
		if (audioReq.isValid()) {
			queue.add(audioReq);
		}
		else {
			throw new Error("Bad Audio Request Data");
		}
		
	};
	
	instance.getControlInterface = function() {
		
		return {
			properties : {
				artist : null,
				currentTime : null,
				title : null,
				totalTime : null
			},
			play : null, 		// player.play
			pause : null, 		// player.play
			rewind : null,		// player.rewind
			forward : null		// player.forward
		};
		
	};
	
	
}

module.exports = LocalQueuePlayer;