var _ = require('underscore');

function LocalIndexPool() {
	// TODO: FINISH!
	
	var instance = this;
	
	instance.indexPool = {};
	
	instance.add = function(indexfile) {
		instance.indexPool[indexfile.clientid] = indexfile.songs;
	};
	
	instance.remove = function(clientid) {
		instance.indexPool = _.omit(instance.indexPool, clientid);
	};
	
	instance.retrieveSong = function(clientid, songid){		
		// return song path
		return = _.findWhere(instance.indexPool.clientid, {songid : songid}).path
	};
}

module.exports = LocalIndexPool;