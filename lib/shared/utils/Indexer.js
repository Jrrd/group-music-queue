var _ = require('underscore'),
	fs = require('fs'),
	file = require('file'),
	path = require('path'),
	metadata = require('musicmetadata'),
	logger = require('../logging/Logger').getLogger('client'),
	supportedFormats = require('../../server/properties').SUPPORTED_FORMATS,
	defaultDestination = require('../../client/properties').DEFAULT_INDEX_FILE_PATH;

// entry points are createFile and updateFile	
var Indexer = function(){
	
	var instance = this;
		
	instance.indexfile = null;
	
	// create new file	
	instance.createFile = function(root, dest){
		// create new index file obj
		instance.indexfile = {
			songs : []
		};
		
		dest = dest || defaultDestination;
				
		// get applicable music files
		var searchResults = search(path.normalize(root));
		
		// grab metadata and add song to new index file and save
		retrieveMetadata(searchResults, 0, dest);
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
		retrieveMetadata(newSongs, getLastSongID() + 1, path.dirname(indexfile));
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
	
	// reads an mp3 file, grabs metadata, and saves when at the last song
	function retrieveMetadata(searchResults, songid, dest){
		var remaining = _.size(searchResults)
		_.each(searchResults, function(musicFile) {
			var parser = new metadata(fs.createReadStream(musicFile));
			parser.on('metadata', function (result) {
				addSong(musicFile, songid, result);
				remaining--;
				songid++;
				if (remaining === 0){
					save(path.normalize(dest));
				}
			});	
		});
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
		fs.writeFile(path.normalize(dest + '/song-index.json'), JSON.stringify(instance.indexfile, null, 4), function (err) {
			if (err) throw err;
		  	logger.info('song-index.json successfully created in ' + dest);
		});
	};
	
	// read index file into a string
	function open(src) {
		return fs.readFileSync(path.normalize(src), 'utf8');
	};
};

module.exports = Indexer; 
