var _ = require('underscore'),
	fs = require('fs'),
	file = require('file'),
	path = require('path'),
	metadata = require('musicmetadata'),
	supportedFormats = require('../../server/properties').SUPPORTED_FORMATS;
	
var Indexer = new function(){
	
	var instance = this;
		searchResults = [];
		aggregatedMetadata = {};
	
	// point of entry	
	instance.createFile = function(root){
		// get applicable music files
		search(root);
		
		// grab metadata from each file and aggregate it
		_.each(searchResults, function(musicFile) {
			var songMetadata = retrieveMetadata(musicFile);
			aggregateMetadata(songMetadata);
		});
	};
	
	// recursively searches directory for supported formats and populates the search results accordingly
	function search(root){
		file.walk(root, function(null, dirPath, dirs, files) {
			searchResults = _.filter(files, function(f){
				return _.contains(supportedFormats, path.extname(f).toLowerCase());
			});
		});		
	};
	
	// reads an mp3 file, and returns its metadata
	function retrieveMetadata(musicFile){
		var parser = new metadata(fs.createReadStream(musicFile));
		
		parser.on('metadata', function (result) {
			return result;
		});	
	}
	
	function aggregateMetadata(songMetadata){
		//TODO : FINISH
	}
};

module.exports = Indexer; 