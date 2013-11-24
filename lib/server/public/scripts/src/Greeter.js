define(function(require) {

	var $ = require('jquery');

	var module = function() {

	};

	module.prototype.insertGreeting = function(elem) {

		$(elem).text("Hi there");

	};


	return module;

});
