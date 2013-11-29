//
// Created On:     11/28/13
// Created By:     jarrod
//

define(function (require) {

	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		Marionette = require('marionette')
		;

	var PlayerViews = {};

	PlayerViews.AudioMetadataView = Marionette.ItemView.extend({
		template : '#player-metadata'

	});

	PlayerViews.PlayerControls = Marionette.ItemView.extend({
		template : '#player-controls',

		/*
		ui : {
			skipBackward    : ".control-skip-backward",
			play            : ".control-play",
			pause           : ".control-pause",
			stop            : ".control-stop",
			skipForward     : ".control-skip-forward"
		},
		*/


		events : {
			'click .control-skip-backward'  : 'back',
			'click .control-play'           : 'play',
			'click .control-pause'          : 'pause',
			'click .control-stop'           : 'stop',
			'click .control-skip-forward'   : 'forward'
		},


		initialize : function(options) {

		},

		back : function(ev) {
			console.log('Called back');
		},

		play : function(ev) {
			console.log('Called play');
		},

		pause : function(ev) {
			console.log('Called pause');
		},

		stop: function(ev) {
			console.log('Called stop');
		},

		forward : function(ev) {
			console.log('Called forward');
		}

	});



	return PlayerViews;
});
