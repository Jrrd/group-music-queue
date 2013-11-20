var _ = require('underscore'),
	fs = require('fs'),
	file = require('file'),
	path = require('path'),
	metadata = require('musicmetadata'),
	supportedFormats = require('../../server/properties').SUPPORTED_FORMATS,
	logger = require('../shared/logging/Logger').getLogger('client');

// entry points are createFile and updateFile	
var Indexer = function(clientid){
	
	var instance = this;
	
	instance.clientid = clientid;
	
	instance.indexfile = null;
	
	// create new file	
	instance.createFile = function(root, dest){
		// create new index file obj
		instance.indexfile = {
			clientid : instance.clientid,
			songs : []
		};
		
		// get applicable music files
		var searchResults = search(path.normalize(root));
		
		// grab metadata and add song to new index file
		var songID = 0;
		_.each(searchResults, function(musicFile) {
			var songMetadata = retrieveMetadata(musicFile);
			addSong(musicFile, songID++, songMetadata);
		});
		
		// save to dest
		save(path.normalize(dest));
	};
	
	// update an existing file
	instance.updateFile = function(root, indexfile){
		// parse file into indexfile obj		
		instance.indexfile = JSON.parse(open(indexfile));
		
		// get new songs from search
		var currentSongs =  retrieveSongList();
		var searchResults = search(path.normalize(root));
		var newSongs = _.filter(searchResults, function(searchedSong){
			return !_.contains(currentSongs, searchedSong);
		});
		
		// grab metadata and append new songs to index file
		var songID = getLastSongID() + 1;
		_.each(newSongs, function(musicFile) {
			var songMetadata = retrieveMetadata(musicFile);
			logger.debug(songMetadata);
			addSong(musicFile, songID++, songMetadata);
		});
		
		// save changes 
		save(path.normalize(fs.dirname(indexfile)));
	};
	
	// recursively searches directory for supported formats and populates the search results accordingly
	function search(root){
		var searchResults = [];
		file.walkSync(root, function(dirPath, dirs, files) {			
			// grab applicable formats
			var dirResult = _.filter(files, function(filename){
				return _.contains(supportedFormats, path.extname(filename).toLowerCase());
			});
		
			// make sure path is normalized
			dirResult = _.map(dirResult, function(filename) {
				return path.normalize(dirPath + "/" + filename);
			}); 
			
			// add walk to overall results
			searchResults = _.union(searchResults, dirResult);
		});
		return searchResults;		
	};
	
	// reads an mp3 file, and returns its metadata
	// TODO : ASYNC IS THROWING ME OFF
	function retrieveMetadata(musicFile){
		var parser = new metadata(fs.createReadStream(musicFile));
		var songMetadata = {};
		parser.on('metadata', function (result) {
			songMetadata = result;
		});	
		return songMetadata;
	};
	
	// adds song to indexfile object
	function addSong(songPath, songid, songMetadata){
		var info = {
			id : songid,
			path : songPath,
			metadata : songMetadata
		};
		instance.indexfile.songs.push(info);
	};
	
	// reads index file and returns an array of song paths
	function retrieveSongList() {
		return _.pluck(instance.indexfile.songs, 'path');
	};
	
	// gets the last songID from indexfile
	function getLastSongID() {
		return _.max(instance.indexfile.songs, function(song){
			return song.id;
		}).id
	};
	
	// save indexfile obj into a JSON file
	function save(dest) {
		fs.writeFile(path.normalize(dest + '/song-index.json'), JSON.stringify(instance.indexfile), function (err) {
			if (err) throw err;
		  	logger.info('song-index.json successfully created in ' + dest);
		});
	};
	
	// read index file into a string
	function open(src) {
		return fs.readFileSync(src, 'utf8');
	};
};

module.exports = Indexer; 
