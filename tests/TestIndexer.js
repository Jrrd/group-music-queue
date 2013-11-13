var Indexer = require('../lib/shared/utils/Indexer'),
	http = require('http');

var indexer = new Indexer("frank");

module.exports = { 
	
	indexFileCreateTest : function(){
		indexer.createFile("./top", ".");
	},	

	indexFileUpdateTest : function(){
		indexer.updateFile(".", "./song-index.json")
	},
	
	indexFileSendToServerTest : function() {
		
	}

};

module.exports.indexFileCreateTest();