define([
	'jquery',
	'backbone',
	'views/SlideShowView'
], function($, Backbone, SlideShowView){

	var Router = Backbone.Router.extend({

		deffered: {},
		
		initialize: function(){
			
			var that = this;

			$('.slideshow').each(function(){
				that.deffered[this.id] = $.Deferred();
				that[this.id + 'View'] = new SlideShowView({el: this, deffered: that.deffered[this.id]});
				that.showSlide(this.id, 1);
			});

			Backbone.history.start();
		},

		routes: {
			'slideshow/:id/:index': 'showSlide'
        },
		
		showSlide: function(id, index){

			var view = this[id + 'View'];

			this.deffered[id].done(function(){
				view.showSlide(index);
				view.setSliderValue(index);
			});
		}
		
	});

	return Router;

});