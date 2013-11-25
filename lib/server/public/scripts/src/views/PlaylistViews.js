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

	var PlaylistViews = {};

	PlaylistViews.EmptyItemView = Marionette.ItemView.extend({
		template : "#empty-list",
		tagName : 'div',
		className : 'playlist-item'
	});

	PlaylistViews.PlaylistItemView = Marionette.ItemView.extend({
		template : "#playlist-item",
		tagName : 'div',
		className : 'playlist-item'
	});

	PlaylistViews.PlaylistCollectionView = Marionette.CollectionView.extend({
		itemView : PlaylistViews.PlaylistItemView,
		emptyView : PlaylistViews.EmptyItemView
	});


	return PlaylistViews;
});
