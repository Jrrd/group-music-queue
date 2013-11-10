var _ = require('underscore'),
	fs = require('fs'),
	file = require('file'),
	path = require('path'),
	metadata = require('musicmetadata'),
	supportedFormats = require('../../server/properties').SUPPORTED_FORMATS;

// entry points are createFile and updateFile	
var Indexer = new function(clientid){
	
	var instance = this,
		instance.clientid = clientid;
		instance.indexfile = null;
	
	// create new file	
	instance.createFile = function(root, dest){
		instance.indexFile = {
			clientid : instance.clientid,
			songs : []
		};
		
		// get applicable music files
		var searchResults = search(root);
		
		// grab metadata from each file and aggregate it along with the path and ID
		var songID = 0;
		_.each(searchResults, function(musicFile) {
			var songMetadata = retrieveMetadata(musicFile);
			addSong(musicFile, songID++, songMetadata);
		});
		
		// save to dest
		save(dest);
	};
	
	// update an existing file
	instance.updateFile = function(root, indexFile){		
		instance.indexfile = JSON.parse(open(indexFile));
		
		var currentSongs =  retrieveSongList(instance.indexfile);
		var searchResults = search(root);
		var newSongs = _.filter(searchResults, function(searchedSong){
			return !_.contains(currentSongs, searchedSong));
		});
		
		var songID = getLastSongID() + 1;
		_.each(newSongs, function(musicFile) {
			var songMetadata = retrieveMetadata(musicFile);
			addSong(musicFile, songID++, songMetadata);
		});
		
		save(fs.dirname(indexFile));
	};
	
	// recursively searches directory for supported formats and populates the search results accordingly
	function search(root){
		var searchResults = [];
		file.walk(root, function(null, dirPath, dirs, files) {
			var dirResult = _.filter(files, function(f){
				return _.contains(supportedFormats, path.extname(f).toLowerCase());
			});
			searchResults = _.union(searchResults, dirResult);
		});
		return searchResults;		
	};
	
	// reads an mp3 file, and returns its metadata
	function retrieveMetadata(musicFile){
		var parser = new metadata(fs.createReadStream(musicFile));
		
		parser.on('metadata', function (result) {
			return result;
		});	
	};
	
	// adds song to indexfile object
	function addSong(songPath, songID, songMetadata){
		var info = {
			id : songid,
			path : songPath,
			metadata : songMetadata
		};
		instance.indexfile.songs.push(info);
	};
	
	// reads index file and returns an array of song paths
	function retrieveSongList(indexFile) {
		return _.pluck(indexFile.songs, 'path');
	};
	
	// gets the last songID from indexfile
	function getLastSongID(indexFile) {
		return _.max(indexFile.songs, function(song){
			return song.id;
		}).id
	};
	
	// save aggregated object into a JSON file
	function save(dest) {
		fs.writeFile(dest + '/song-index.json', JSON.stringify(instance.indexfile), function (err) {
			if (err) throw err;
		  	console.log('song-index.json successfully created in ' + dest);
		});
	};
	
	// read index file into a string
	function open(src) {
		return fs.readFile(src, function (err, data) {
			if (err) throw err;
		  	return data;
		});
	};
};

module.exports = Indexer; 