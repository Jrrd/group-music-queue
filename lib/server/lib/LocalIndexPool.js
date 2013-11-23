var _ = require('underscore'),
	StringUtils = require('../../shared/utils/StringUtils');

function LocalIndexPool() {	
	//TODO: make more robust. very barebones at the moment
	var instance = this;
	
	instance.indexPool = {};
	
	// add index file to pool
	instance.add = function(clientid, indexfile) {
		if (isValid(clientid, indexfile)) {
			instance.indexPool[clientid] = indexfile.songs;
		} else {
			throw new Error("Error: Invalid Index File");
		}
	};
	
	// remove index file from pool
	instance.remove = function(clientid) {
		console.log(instance.indexPool[clientid]);
		if (!(instance.indexPool && delete instance.indexPool[clientid])){
			throw new Error("Error: Unable to remove index file for client " + clientid);
		}
	};
	
	// retrieve song path from pool (it might not be needed)
	instance.retrieveSong = function(clientid, songid){		
		// return song path
		return _.findWhere(instance.indexPool[clientid], {songid : songid}).path
	};
	
	// retrieve list of songs from pool
	instance.retrieveSongs = function(clientid){
		if (clientid) {
			// return just the client's songs
			if (instance.indexPool[clientid]) {
				return instance.indexPool[clientid]
			}
			throw new Error("Error: Unable find an index file for client " + clientid);
		} else {
			// else return the whole index pool objects
			return _.clone(instance.indexPool);
		}	
	};
	
	//TODO : Add more checks
	function isValid(clientid, indexfile){
		if (!StringUtils.hasValue(clientid) ||
			!StringUtils.hasValue(indexfile.songs)) {
		
			console.log('Contents of Bad Index File', indexfile);
			return false;
		}
		return true;
	};
}

module.exports = LocalIndexPool;