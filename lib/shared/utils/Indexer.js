var _ = require('underscore'),
	fs = require('fs'),
	file = require('file'),
	path = require('path'),
	metadata = require('musicmetadata'),
	supportedFormats = require('../../server/properties').SUPPORTED_FORMATS;

// entry points are createFile and updateFile	
var Indexer = new function(clientid){
	
	var instance = this,
		searchResults = [],
		indexfile = {
			clientid : clientid,
			songs : []
		};
	
	// create new file	
	instance.createFile = function(root, dest){
		// get applicable music files
		var searchResults = search(root);
		
		// grab metadata from each file and aggregate it along with the path and ID
		var songID = 0;
		_.each(instance.searchResults, function(musicFile) {
			var songMetadata = retrieveMetadata(musicFile);
			addSong(musicFile, songID++, songMetadata);
		});
		
		// save to dest
		save(dest);
	};
	
	// update an existing file
	instance.updateFile = function(root, indexFile){
		/*
		TODO : 
			1. get filesname of all existing songs
			2. search root for songs, while filter out duplicates
			3. append new songs to index file
		*/
	};
	
	// recursively searches directory for supported formats and populates the search results accordingly
	function search(root){
		file.walk(root, function(null, dirPath, dirs, files) {
			var searchResults = _.filter(files, function(f){
				return _.contains(supportedFormats, path.extname(f).toLowerCase());
			});
		});
		return searchResults;		
	};
	
	// reads an mp3 file, and returns its metadata
	function retrieveMetadata(musicFile){
		var parser = new metadata(fs.createReadStream(musicFile));
		
		parser.on('metadata', function (result) {
			return result;
		});	
	}
	
	// adds song to indexfile object
	function addSong(musicFile, songID, songMetadata){
		var info = {
			songid : songid,
			path : musicFile,
			metadata : songMetadata
		};
		instance.indexfile.songs.push(info);
	}
	
	// save aggregated object into a JSON file
	function save(dest) {
		fs.writeFile(dest + '/song-index.json', JSON.stringify(instance.indexfile), function (err) {
		  if (err) throw err;
		  console.log('song-index.json successfully created in ' + dest);
		});
	}
};

module.exports = Indexer; 