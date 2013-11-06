
var _ = require("underscore");

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


module.exports = AudioRequestData;