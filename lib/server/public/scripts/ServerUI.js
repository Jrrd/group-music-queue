
require.config({
	paths : {
		backbone : 'lib/backbone',
		underscore : 'lib/underscore',
		jquery : 'lib/jquery',
		marionette : 'lib/backbone.marionette',

		mods : 'src'
	},
	shim : {
		jquery : {
			exports : 'jQuery'
		},
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : ['jquery', 'underscore'],
			exports : 'Backbone'
		},
		marionette : {
			deps : ['jquery', 'underscore', 'backbone'],
			exports : 'Marionette'
		}
	},

	waitSeconds: 15

});


require( ["jquery", "mods/Greeter"],
	function($, Greeter) {
		//This function will be called when all the dependencies
		//listed above are loaded. Note that this function could
		//be called before the page is loaded.
		//This callback is optional.

		var $elem = $('#greeting'),
			greeter = new Greeter();

		setTimeout(function() {
			greeter.insertGreeting($elem.get(0));
		}, 3000);

	}
);


