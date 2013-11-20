
var AudioRequestData = require('../../shared/dataobjects/AudioRequestData')
// ,	MusicPlayer = require('./MusicPlayer')
,	MusicPlayer = require('./players/MPlayerSlave')
,	IMusicPlayer = require('./players/IMusicPlayer')
,	http = require('http')
,	querystring = require('querystring')
,   logger = require('../../shared/logging/Logger').getLogger('server')
;

function LocalQueuePlayer(queue, playerOptions) {

    var instance = this,
    player = new MusicPlayer(); // this will be the player implementation object

	player.start(null, {
		stream : true
	});
	
	player.on('done', function() {
		instance.playNext();
	});
	
	queue.on('item-new', function() {
		
		logger.debug('New Item Detected.');
		logger.debug('Current Player Status: ' + player.getStatus());


		if (player.getStatus() !== IMusicPlayer.STATUS.PLAYING) {

			instance.playNext();
		}
	});
	
	instance.playNext = function() {
		logger.debug('Attempting to playNext');
		if (queue.getLength() > 0) {
			var audioReq = new AudioRequestData(queue.getNext());
			logger.debug('requesting to play: ', audioReq);
			
			if (audioReq.isValid()) {
				
				var options = {
					host: audioReq.client,
					port: audioReq.port,
					method: 'POST',
					path: '/musicstream',
					headers: {
						"Content-Type" : "application/json"
					}
					
				};
				
				var req = http.request(options, function(res) {
					logger.debug("Got response: " + res.statusCode);
					
					// player.playHttpStream(res);
					//player.setAudioFileInputStream(res);
					res.pipe(player.getAudioFileInputStream());

				})
				.on('error', function(e) {
					logger.debug("Got error: " + e.message);
				});
				
				// var postData = querystring.stringify(audioReq);
				var postData = JSON.stringify(audioReq);
				
				logger.debug('Server sending out for the following: ', postData);
				
				req.end(postData);
				
			}
		}
		else {
			logger.warn('No more songs in the queue');
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


	// TODO: should be tied to the IMusicPlayer interface
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
