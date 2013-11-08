
var _ = require("underscore")
,	StringUtils = require("../utils/StringUtils");

function AudioRequestData(props) {
	
	var instance = this;
	
	// TODO: make sure this is working as expected
	_.defaults(instance, props, instance.EMPTY_PROPERTIES);
	
}

AudioRequestData.prototype.EMPTY_PROPERTIES = {
	client 		: null,
	port 		: null,
	filepath 	: null
};

AudioRequestData.prototype.setProperties = function(client, port, filepath) {
	this.client = client;
	this.port = port;
	this.filepath = filepath;
};

AudioRequestData.prototype.isValid = function() {

	if (!StringUtils.hasValue(this.client) ||
			!StringUtils.hasValue(this.port) || 
			!StringUtils.hasValue(this.filepath)) {
		
		console.log('Contents of Bad Audio Request', this);
		return false;
	}
	
	return true;
};


module.exports = AudioRequestData;