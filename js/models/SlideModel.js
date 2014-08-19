define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var SlideModel = Backbone.Model.extend({

		initialize: function() {
		},
		
		defaults: {
			"title": "TITLE",
			"text": "TEXT",
			"img": null,
			"color": "#000",
			"background-color": "#fff",
			"layout": "right"
		}

	});

    return SlideModel;
} );