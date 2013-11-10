var Indexer = require('../lib/shared/utils/Indexer');

var indexer = new Indexer("frank");

module.exports = { 
	
	indexFileCreateTest : function(){
		indexer.createFile("./top", ".");
	},	

	indexFileUpdateTest : function(){
		indexer.updateFile(".", "./song-index.json")
	}

};

module.exports.indexFileCreateTest();