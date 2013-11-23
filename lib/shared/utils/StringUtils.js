
function StringUtils() {};

// var StringUtils = new (function() {})();



StringUtils.prototype.hasValue = function(str) {
	
	if (// typeof str !== "string"	|| 
			str == null || 
			str === "") {
		
		return false;
		
	}
	
	return true;
};




module.exports = new StringUtils;