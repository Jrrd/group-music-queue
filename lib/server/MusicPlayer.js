
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
	
	var speakerOut = new speaker(),
		decoder = new lame.Decoder(),
		currentStatus = STATUS.STOPPED,
		fileReader = null
		;
	
	instance.playFile = function(file) {

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
		
		
		fileReader = fs.createReadStream(file);
		
		fileReader
		.on('data', function(chunk) {
			if (!decoder.write(chunk)) {
				console.log('file reader paused');
				fileReader.pause();
			}
		});
		
		/*
		.on('drain', function() {
			console.log('file reader resumed');
			fileReader.resume();
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
			fileReader.resume();
		});
		
		speakerOut
		.on('drain', function() {
			console.log('speaker drained');
			if (currentStatus === STATUS.PLAYING) {
				decoder.resume();
			}
		});

		
		currentStatus = STATUS.PLAYING;
		
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
			decoder.resume();
			console.log('manually triggering speaker \'drain\'');
			speakerOut.emit('drain');
		}
	};

	return instance;
};

module.exports = MusicPlayer;