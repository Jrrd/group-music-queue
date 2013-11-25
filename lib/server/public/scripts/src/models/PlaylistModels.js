//
// Created On:     11/24/13
// Created By:     jarrod
//

define(function (require) {

	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		Marionette = require('marionette')
		;

	var PlaylistModels = {};

	PlaylistModels.PlaylistItem = Backbone.Model.extend({});

	PlaylistModels.CurrentPlaylist = Backbone.Collection.extend({
		model : PlaylistModels.PlaylistItem,
		url : '/current-playlist'
	});



	return PlaylistModels;
});
