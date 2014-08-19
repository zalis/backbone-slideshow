define([
	'jquery',
	'underscore',
	'backbone',
	'models/SlideModel'
], function($, _, Backbone, SlideModel){

	var SlidesCollection = Backbone.Collection.extend({
      
		model: SlideModel,

		initialize: function(models, options) {
			this.json = options.json;
		},
      
		url: function(){
			return this.json;
		}
    
	});

	return SlidesCollection;
});