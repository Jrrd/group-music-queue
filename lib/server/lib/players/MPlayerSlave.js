
// J.Whelan
// This class wraps the 'mplayer' command line process - make sure it exists on the server 

var spawn 		= require('child_process').spawn
,	events 		= require('events')
,	os	 		= require('os')
,	path 		= require('path')
,	util 		= require('util')
,	events 		= require('events')
,	_ 			= require('underscore')
,	fifojs		= require('fifojs')
,	fs			= require('fs')
,   logger      = require('../../../shared/logging/Logger').getLogger('server')
,	MusicPlayerInterface = require('./IMusicPlayer')

,   STATUS      = MusicPlayerInterface.STATUS
;


var MPlayerSlave = function() {

	MusicPlayerInterface.call(this);
	events.EventEmitter.call(this);

	this.cmdFifoPath = createFifo();
	this.cmdStream = fs.createWriteStream(this.cmdFifoPath, {
		flags: 'a+'
	});

};

// util.inherits(MPlayerSlave, MusicPlayerInterface);
// util.inherits(MPlayerSlave, events.EventEmitter);

_(MPlayerSlave.prototype).extend(events.EventEmitter.prototype, MusicPlayerInterface.prototype);




MPlayerSlave.prototype.audioStream = null;

MPlayerSlave.prototype.getAudioFileInputStream = function() {
	return this.audioStream;
};

MPlayerSlave.prototype.setAudioFileInputStream = function(stream) {
	this.audioStream = stream;
};

MPlayerSlave.prototype.start = function (cmdLineOptions, flags) {
    var args = [];

    var slaveOptions = {
		// "slave" 			: "", // NOTE: causes issues when files are streamed via STDIN
		// "idle"				: "",
		// "quiet" 			: "",
	    "really-quiet" 		: "",
	    "input" 			: "nodefault-bindings:conf=/dev/null:file=" + this.cmdFifoPath,
	    "noconfig" 			: "all",
	    "cache" 			: "512" 		// in KB
	};

    var defFlags = {
		"stream"	: false
    };

    var options = _.defaults(slaveOptions, cmdLineOptions);
    flags = _.defaults({}, flags, defFlags);

    for(var prop in options) {
        if(options.hasOwnProperty(prop)){
            args.unshift('-'+prop, options[prop] );
        }
    }

	if (flags.stream) {
		// allow file to be streamed in
		args.push("-");
	}

	// this.child = spawn('mplayer', args, {stdio: ['pipe', 'ignore', 'ignore']});
    this.child = spawn('mplayer', args);
    this.child.on('exit', function (code, sig) {
        if (code !== null && sig === null) {

            // attempt to cleanup FIFO
        	this.cmdStream.end();
            fs.unlinkSync(this.cmdFifoPath);

            this.emit('done');
            logger.debug("Slave instance has been killed.");
        }
    }.bind(this));

    // mplayer stdin will be used to stream audio in
    this.setAudioFileInputStream(this.child.stdin);

	logger.debug('Are we detecting data passing through to mplayer?');
	this.getAudioFileInputStream().once("data", function(data) {
		logger.debug("Detect File Playing");
		this.setStatus(STATUS.PLAYING);
	})

    // pipe mplayer output to stdout
    this.child.stdout.pipe(process.stdout);
    this.child.stderr.pipe(process.stderr);

    logger.info('Slave instance started...');
    logger.info('Command FIFO at: ' + this.cmdFifoPath);
};


MPlayerSlave.prototype.sendCommand = function(commandStr) {
	if (this.child != null) {

		this.cmdStream.write(commandStr + "\n");
		logger.debug('Sent the following command(s) to mplayer: \n' + commandStr);

	}

};

MPlayerSlave.prototype.play = function(filepath) {
	this.setStatus(STATUS.PLAYING);

	this.sendCommand('play');
}

MPlayerSlave.prototype.playFile = function(filepath) {
	this.setStatus(STATUS.PLAYING);

	this.sendCommand("loadfile '" + filepath +"'");
};

MPlayerSlave.prototype.pause = function() {
	if (this.getStatus === STATUS.PLAYING) {
		this.sendCommand('pause');
	}
};

MPlayerSlave.prototype.pauseToggle = function() {
	var curStatus = this.getStatus();
	if (curStatus === STATUS.PLAYING) {
		this.setStatus(STATUS.PAUSED);
	}
	else if (curStatus === STATUS.PAUSED) {
		this.setStatus(STATUS.PLAYING);
	}
	else {
		this.setStatus(STATUS.UNKNOWN);
	}
	this.sendCommand("pause");

};

MPlayerSlave.prototype.stop = function(filepath) {
	this.setStatus(STATUS.STOPPED);

	this.sendCommand("stop");
};

MPlayerSlave.prototype.volumeAdjust =
MPlayerSlave.prototype.volumeRelative = function(value) {
	this.sendCommand("volume " + value);
};

MPlayerSlave.prototype.volume =
MPlayerSlave.prototype.volumeAbsolute = function(value) {
	this.sendCommand("volume " + value + " 1");
};

MPlayerSlave.prototype.mute = function() {
	this.sendCommand("mute");
};


// this method was a test -- it would need a little more 
// work to extract output from the child process
/*
MPlayerSlave.prototype.logTrackTitle = function() {
	this.sendCommand("get_meta_title");
};
*/

MPlayerSlave.prototype.close =
MPlayerSlave.prototype.end =
MPlayerSlave.prototype.kill = function () {
	
	/*
	this.getAudioFileInputStream().end();
	this.child.stdout.pipe(process.stdout);
    this.child.stderr.pipe(process.stderr);
    */
	this.setStatus(STATUS.STOPPED);
	this.sendCommand("quit 0");
	
	// give it a couple seconds and check 
	// if we need to forcefully kill the process
	setTimeout(function() {
	    if(this.child){
	        this.child.kill('SIGTERM');
	    }
	}, 3000);
};



/*
MPlayerSlave.prototype.pause = function () {
    if (this.stopped) return;
    if(this.child){
        this.child.kill('SIGSTOP');
    }
    this.emit('pause');
};
MPlayerSlave.prototype.resume = function () {
    if (this.stopped) return this.play();
    if(this.child){
        this.child.kill('SIGCONT');
    }
    this.emit('resume');
};
 */

function createFifo() {
	var uniqueExtension = (Math.random()+"").substring(1),
		fifoPath = path.join(os.tmpdir(), 'mp_cmd_pipe' + uniqueExtension );
	
	fifojs.mkfifo(fifoPath, 0777);
	
	return fifoPath;
}

module.exports = MPlayerSlave;
