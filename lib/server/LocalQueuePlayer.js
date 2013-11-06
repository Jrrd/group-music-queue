
function LocalQueuePlayer(queue, playerOptions) {
	
	var instance = this,
		player = null; // this will be the player implementation object
	
	instance.start = function() {
		
	};
	
	instance.reset = function() {
		
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

module.exports = LocalPlayer;