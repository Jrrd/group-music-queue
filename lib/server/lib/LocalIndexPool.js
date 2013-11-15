var _ = require('underscore'),
	StringUtils = require('../../shared/utils/StringUtils');

function LocalIndexPool() {	
	//TODO: make more robust. very barebones at the moment
	var instance = this;
	
	instance.indexPool = {};
	
	instance.add = function(indexfile) {
		if (isValid(indexfile)) {
			instance.indexPool[indexfile.clientid] = indexfile.songs;
		} else {
			throw new Error("Error: Invalid Index File");
		}
	};
	
	instance.remove = function(clientid) {
		instance.indexPool = _.omit(instance.indexPool, clientid);
		if(_.has(instance.indexPool, clientid)){
			throw new Error("Error: Unable to remove index file for client " + clientid);
		}
	};
	
	instance.retrieveSong = function(clientid, songid){		
		// return song path
		return _.findWhere(instance.indexPool.clientid, {songid : songid}).path
	};
	
	//TODO : Add more checks
	function isValid(indexfile){
		if (!StringUtils.hasValue(indexfile.clientid) ||
			!StringUtils.hasValue(indexfile.songs)) {
		
			console.log('Contents of Bad Index File', indexfile);
			return false;
		}
		return true;
	};
}

module.exports = LocalIndexPool;