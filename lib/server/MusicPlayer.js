
var fs = require('fs'),
	lame = require('lame'),
	speaker = require('speaker')
	;

var MusicPlayer = function() {
	
	var instance = this;
	
	var STATUS = {
			STOPPED : 0,
			PLAYING : 1,
			PAUSED	: 2
	};
	
	var	currentStatus = STATUS.STOPPED,
		mp3InputStream = null,
		decoder = new lame.Decoder(),
		speakerOut = new speaker()
		;
	
	
	var play = function() {
		
		if (mp3InputStream) {
			
			mp3InputStream
			.on('data', function(chunk) {
				if (!decoder.write(chunk)) {
					console.log('file reader paused');
					mp3InputStream.pause();
				}
			});
			
			/*
			.on('drain', function() {
				console.log('file reader resumed');
				mp3InputStream.resume();
			});
			*/
			
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
				if (currentStatus === STATUS.PLAYING) {
					decoder.resume();
				}
			});

			
			currentStatus = STATUS.PLAYING;
			
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
			
			currentStatus = STATUS.PLAYING;
		}
		 */
		
		mp3InputStream = fs.createReadStream(filePath);
		play();
				
	};
	
	instance.pause = function() {
		if (currentStatus !== STATUS.PAUSED) {
			decoder.pause();
			// speakerOut.end();
			currentStatus = STATUS.PAUSED;
		}
	};
	
	instance.resume = function() {
		if (currentStatus !== STATUS.PLAYING) {
			// speakerOut = new speaker();
			currentStatus = STATUS.PLAYING;
			// decoder.resume();
			console.log('manually triggering speaker \'drain\'');
			speakerOut.emit('drain');
		}
	};

	return instance;
};

module.exports = MusicPlayer;