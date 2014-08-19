define([
	'jquery',
	'underscore',
	'backbone',
	'collections/SlidesCollection',
	'text!../../templates/SlideTemplate.html'
], function($, _, Backbone, SlidesCollection, SlideTemplate){

	var SlidesListView = Backbone.View.extend({
		
		deffered: $.Deferred(),
    
		count: 0,
		
		initialize: function(options){
	
			var that = this;
			
			that.thumbnails = options.thumbnails;
			
			that.collection = options.collection;
			
			that.collection.fetch({
				success: function(collection){
					that.render();
				},
				dataType: "json"
			});
			
		},
		
		render: function(){

			var that = this;
			
			var slides = that.collection.models;
			
			_.each(slides, function(slide, i){
				
				var el =  $(_.template(SlideTemplate, {
					i: i,
					id: that.id,
					slide: slide
				})).appendTo(that.el);
				
				if (slide.has('img')){
					
					var src = slide.get('img');
					
					var img = new Image();
					img.src = src;
					
					$(img).load(function(){
						that.createThumbnail(el, img);
					});
											
				}
				
				else{
						that.createThumbnail(el);
				}
				
			});
			
		},
		
		createThumbnail: function(el, img){
			var that = this;
			
			that.count++;
						
			var thumbnail = $('<li>')
				.attr({
					'style': el.attr('style'),
					'data-index': el.attr('data-index')
				})
				.addClass(el.attr("class"))
				.css('display', 'none')
				.html(el.html())
				.appendTo(that.thumbnails.find('ul'))
				
			if (img){		
					var width = img.width / img.height * 50;
					var canvas = document.createElement("canvas");
					canvas.setAttribute('width', width);
					canvas.setAttribute('height', 50);
					var ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, 50);
					thumbnail.prepend($(canvas));
					thumbnail.find('img').remove();
			};
			
			if (that.count == that.collection.length) {

				setTimeout(function(){
					that.deffered.resolve();
				}, 50);
				
			}
			
		}
	
	});
	
	return SlidesListView;
});
