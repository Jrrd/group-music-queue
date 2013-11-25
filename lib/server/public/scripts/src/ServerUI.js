//
// Created On:     11/23/13
// Created By:     jarrod
//

define(function (require) {

	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		Marionette = require('marionette')
		;

	var ServerUI = new Marionette.Application();

	/*
	var ServerUI = function (options) {

		this.app = new Marionette.Application();
		this.app.start(options);


		// start event is thrown after initializers run successfully
		this.app.on('start', function(options) {
			Backbone.history.start();
		});
	};

	var proto = ServerUI.prototype;
	*/

	return ServerUI;
});
