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

	var PlayerModels = {};

	PlayerModels.AudioMetadataModel = Backbone.Model.extend({

		initialize : function() { },

		url : function() {
			return '/current-audio-metadata';
		}

	});

	PlayerModels.ControlInterfaceModel = Backbone.Model.extend({

		command: 'play',

		url: function() {
			return createCommandURL.call(this, this.get('command'));
		}

	});

	function createCommandURL(commandStr) {
		return '/player-command/' + commandStr;
	}


	return PlayerModels;
});
