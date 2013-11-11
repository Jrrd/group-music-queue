
var util = require('util'),
	events = require('events'),
	fs = require('fs'),
	lame = require('lame'),
	speaker = require('speaker')
	;

var MusicPlayer = function() {
	
	var instance = this;
	events.EventEmitter.call(instance);
	
	var	currentStatus = instance.STATUS.STOPPED,
		mp3InputStream = null,
		decoder = new lame.Decoder(),
		speakerOut = new speaker()
		;
	
	
	var play = function() {
		
		if (mp3InputStream) {
			/*
			mp3InputStream
			.on('data', function(chunk) {
				if (!decoder.write(chunk)) {
					console.log('file reader paused');
					mp3InputStream.pause();
				}
			});
			
			/ *
			.on('drain', function() {
				console.log('file reader resumed');
				mp3InputStream.resume();
			});
			* /
			
			decoder
			.on('data', function(chunk) {
				if (!speakerOut.write(chunk)) {
					console.log('decoder paused');
					decoder.pause();
				}
				
			})
			.on('format', console.log)
			.on('drain', function() {
				console.log('decoder resumed');
				mp3InputStream.resume();
			});
			
			speakerOut
			.on('drain', function() {
				console.log('speaker drained');
				if (currentStatus === instance.STATUS.PLAYING) {
					decoder.resume();
				}
			});
			*/

			mp3InputStream
			.pipe(decoder).on('format', console.log)
			.pipe(speakerOut).on('finish', function() {
				instance.emit('finish');
			});

			currentStatus = instance.STATUS.PLAYING;
			
		}
	};
	
	instance.playHttpStream = function(responseStream) {
		mp3InputStream = responseStream;
		play();
	};
	
	instance.playFile = function(filePath) {

		/*
		// simple but can't be paused
		// 
		if (fileReader) {
			
			fileReader
			.pipe(new lame.Decoder)
			.on('format', console.log)
			.pipe(speakerOut);
			
			currentStatus = instance.instance.STATUS.PLAYING;
		}
		 */
		
		mp3InputStream = fs.createReadStream(filePath);
		play();
				
	};
	
	instance.pause = function() {
		if (currentStatus !== instance.STATUS.PAUSED) {
			decoder.pause();
			// speakerOut.end();  // should stop sound
			currentStatus = instance.STATUS.PAUSED;
		}
	};
	
	instance.resume = function() {
		if (currentStatus !== instance.STATUS.PLAYING) {
			// speakerOut = new speaker();
			currentStatus = instance.STATUS.PLAYING;
			// decoder.resume();
			console.log('manually triggering speaker \'drain\'');
			speakerOut.emit('drain');
		}
	};

	instance.getStatus = function() {
		return currentStatus;
	};

	return instance;
};

util.inherits(MusicPlayer, events.EventEmitter);

MusicPlayer.prototype.STATUS = {
	STOPPED : 0,
	PLAYING : 1,
	PAUSED	: 2
};


module.exports = MusicPlayer;