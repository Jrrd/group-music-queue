var properties = {	
	FILE_FEEDER_PORT : 2500,
	DEFAULT_INDEX_FILE_PATH : process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] // home directory
};

module.exports = properties;
