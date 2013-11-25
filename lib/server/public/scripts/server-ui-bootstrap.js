
require.config({
	baseUrl : 'scripts',

	paths : {
		lib : './lib',

		base : './src',
		views : './src/views',
		models : './src/models',

		backbone : 'lib/backbone',
		underscore : 'lib/underscore',
		jquery : 'lib/jquery',
		marionette : 'lib/backbone.marionette'

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


require( ['backbone', 'base/ServerUI', 'models/PlaylistModels', 'views/PlaylistViews'],
	function(Backbone, ServerUI, PlaylistModels, PlaylistViews) {
		//This function will be called when all the dependencies
		//listed above are loaded. Note that this function could
		//be called before the page is loaded.
		//This callback is optional.

		// start event is thrown after initializers run successfully
		ServerUI.on('start', function(options) {
			Backbone.history.start();
		});

		ServerUI.addRegions({
			player: '#player',
			playlist: '#playlist'
		});

		ServerUI.start();

		var currentPlaylistCollection = new PlaylistModels.CurrentPlaylist();
		var playlistView = new PlaylistViews.PlaylistCollectionView({
			// tagName : 'ul',
			collection : currentPlaylistCollection
		});


		ServerUI.playlist.show(playlistView);


		// refresh the collection every 5 seconds -- not ideal, but will work for now.
		var listRefreshInterval = setInterval(function() {
			currentPlaylistCollection.fetch();
		}, 5000);


	}
);


