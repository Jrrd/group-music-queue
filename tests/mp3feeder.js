
var	fs = require('fs'),
	MPlayerSlave = require('../lib/server/lib/players/MPlayerSlave');

var slave = new MPlayerSlave();
slave.start(null, {stream : true});

var waitPlay = 1;
var waitStop = 5;

console.log('+++++++++++++++++++++++++++++++++++++++++++');
console.log('Playing in ' + waitPlay + ' seconds');
console.log('+++++++++++++++++++++++++++++++++++++++++++');


var readStream;

setTimeout(function() {
	
	var musicPipe = slave.getAudioFileInputStream();
	
	readStream = fs.createReadStream('/Users/jarrod/Music/iTunes/iTunes Music/Nada Surf/The Weight Is a Gift/03 Always Love.mp3')
		.on('error', function(err) {
			console.log(err);
		});
	
	readStream
		.pipe(musicPipe)
		.on('error', function(err) {
			// pipe may have been closed on the receiving end 
			readStream.close();
		});
		
}, waitPlay*1000);

console.log('+++++++++++++++++++++++++++++++++++++++++++');
console.log('Stopping in ' + waitStop + ' seconds');
console.log('+++++++++++++++++++++++++++++++++++++++++++');

setTimeout(function() {
	
	slave.close();
	
}, waitStop*1000);
