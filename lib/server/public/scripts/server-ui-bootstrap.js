
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


require( ['backbone', 'jquery', 'base/ServerUI', 'models/PlayerModels', 'views/PlayerViews', 'models/PlaylistModels', 'views/PlaylistViews'],
	function(Backbone, $, ServerUI, PlayerModels, PlayerViews, PlaylistModels, PlaylistViews) {
		//This function will be called when all the dependencies
		//listed above are loaded. Note that this function could
		//be called before the page is loaded.
		//This callback is optional.

		// start event is thrown after initializers run successfully
		ServerUI.on('start', function(options) {
			Backbone.history.start();
		});

		ServerUI.addRegions({
			player:         '#player', // should load layout?
			audioinfo:      '#player .audio-info-container',
			controls:       '#player .controls-container',
			playlist:       '#playlist'
		});

		ServerUI.addInitializer(function() {

			var unknown = 'Unknown';
			var songMetadataModel = new PlayerModels.AudioMetadataModel({
					title: unknown,
					artist: unknown,
					client: unknown
				}),
				metadataView = new PlayerViews.AudioMetadataView({
					model : songMetadataModel
				});


			var playerModel = new PlayerModels.ControlInterfaceModel(),
				playerView = new PlayerViews.PlayerControls({
					model : playerModel
				});


			var currentPlaylistCollection = new PlaylistModels.CurrentPlaylist(),
				playlistView = new PlaylistViews.PlaylistCollectionView({
					collection : currentPlaylistCollection
				});

			ServerUI.audioinfo.show(metadataView);
			ServerUI.controls.show(playerView);
			ServerUI.playlist.show(playlistView);

			// refresh the collection every 5 seconds -- not ideal, but will work for now.
			var listRefreshInterval = setInterval(function() {
				currentPlaylistCollection.fetch();
			}, 5000);

		});

		ServerUI.start();


	}
);


