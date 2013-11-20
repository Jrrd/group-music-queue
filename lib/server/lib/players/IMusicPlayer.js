// Created: Nov 17, 2013


// Module Object --------------------------
/**
 * This object is primarily an interface.  Other objects should inherit from
 * this object and override the 'unimplemented' methods.
 * @interface
 */
var IMusicPlayer = function() {
		
	var _isMusicPlayer = true;

	/*
	this.play = 
	this.pause = 
	this.stop = unimplemented;
	*/

	this.isMusicPlayer = function() {
		return _isMusicPlayer;
	};
		
};

IMusicPlayer.STATUS = {
	UNKNOWN : "unknown",
	STOPPED : "stopped", 
	PAUSED  : "paused",
	PLAYING : "playing"
};


function unimplemented() {
	throw new Error("Unimplemented MusicPlayer Method");
}



IMusicPlayer.prototype.status = IMusicPlayer.STATUS.UNKNOWN;

IMusicPlayer.prototype.play =
IMusicPlayer.prototype.pause =
IMusicPlayer.prototype.stop = unimplemented;

IMusicPlayer.prototype.getStatus = function() {
	return this.status;
};

IMusicPlayer.prototype.setStatus = function(status) {
	this.status = status;
};

// var instance = new IMusicPlayer();

module.exports = IMusicPlayer;

