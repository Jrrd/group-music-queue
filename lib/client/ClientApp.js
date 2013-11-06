
var FileFeeder = require('./services/FileFeeder');

var properties = {
		
		FILE_FEEDER_PORT : 2500
};

var fileFeeder = new FileFeeder(properties.FILE_FEEDER_PORT);
fileFeeder.start();



