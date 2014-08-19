define([
	'jquery',
	'underscore',
	'backbone',
	'collections/SlidesCollection',
	'views/SlidesListView',
	'text!../../templates/SlideShowTemplate.html',
	'text!../../templates/ThumbnailsTemplate.html',
	'text!../../templates/ToolBarTemplate.html',
	'css!../../css/slideshow.css',
	'css!libs/jquery/jquery-ui/jquery-ui.min.css',
	'libs/jquery/jquery-ui/jquery-ui.min'
], function($, _, Backbone, SlidesCollection, SlidesListView, SlideShowTemplate, ThumbnailsTemplate, ToolBarTemplate){

	var SlideShowView = Backbone.View.extend({
		
		delay: 5000,
    
		events: {
			'click .slide': 'onClickSlide',
			'click #playButton': 'onClickPlay',
			'mousemove .slider': 'onMouseMove',
			'mouseleave .slider': 'onMouseLeave',
			'mousedown .slider': 'pause'
		},

		initialize: function(options){
			
			this.id = this.$el.attr('id');
			
			this.deffered = options.deffered;
			
			this.delay = this.$el.attr('data-delay') || this.delay;
			
			this.collection =  new SlidesCollection([], {json: this.$el.attr('data-json')});
			
			this.render();
	
		},
	
		render: function(){
			
			var that = this;
									
			var el = $(_.template(SlideShowTemplate, {id: that.id})).appendTo(that.$el);
			
			that.thumbnails = $(_.template(ThumbnailsTemplate, {id: that.id})).appendTo('body');
			
			var slideList = new SlidesListView({
				id: that.id,
				el: el,
				thumbnails: that.thumbnails,
				collection: that.collection
			});
			
			var toolbar = $(_.template(ToolBarTemplate, {})).appendTo(that.$el);
			
			slideList.deffered.done(function(){
				
				that.playButton = toolbar.find('#playButton');
				
				that.Slider = toolbar.find('.slider'); 
				
				that.Slider.index = 0;
				
				that.Slider.slider({
					range: "min",
					value: 1,
					min: 1,
					max: that.Slider.width(),
					slide: function( event, ui ) {
					},
					change: function( event, ui ) {
						if (event.originalEvent) {
							that.Slider.index = that.getSliderValue(ui.value);
							that.navigate(that.Slider.index);
						};
					}
				})
					
				that.thumbnails.css('top', function(){return that.Slider.offset().top - $(this).height() - 10});

				that.deffered.resolve();
			});
		},
		
		getSliderValue: function(value){
			
			var size = this.collection.length;
			var val = parseInt(value / (this.Slider.width() / size) + 1);
			if (val < 1) val = 1;
			if (val > size) val = size;
			return val;
			
		},
		
		setSliderValue: function(index){
			if (index != this.Slider.index * 1 && index <= this.collection.length && index > 0){
				this.Slider.slider('value', (index - (1 - index / this.collection.length)) * this.Slider.width() / this.collection.length);
			}
		},
		
		onClickSlide: function(e){
			
			var index = parseInt($(e.currentTarget).attr('data-index')) + 1;
			
			if (index <= this.collection.length) {
			
				this.navigate(index);
			};
		},
		
		onClickPlay: function(){
			
			if (this.isPlaying) {
				this.pause();
			}
			else {
				this.play();
			}
		},
		
		onMouseMove: function(e){

			var width = this.Slider.width();
			var offset = this.Slider.offset();

			var value = Math.round(((e.pageX - offset.left) / width) * width);
		
			this.showThumbnails(e.pageX, this.getSliderValue(value));
		},
		
		onMouseLeave: function(){

			this.hideThumbnails();
		},

		navigate: function(index){

			Backbone.history.navigate('#/slideshow/' + this.id + '/' + index , true); 
		},
		
		showSlide: function(index){
			
			if (index >= 0 && index <= this.collection.length) {
			
				if (this.current) {
					this.animate(index)
				}
				else {
					this.show(index);
				}
			};
		},
		
		show: function(index){
			
			this.getElement(index).show();
			if (index != this.current) this.getElement(this.current).hide();
			this.current = index;
		},
		
		animate: function(index){
			
			this.getElement(index).fadeIn();
			if (index != this.current) this.getElement(this.current).fadeOut();
			this.current = index;
			
			this.setSliderValue(index);
		},
		
		showThumbnails: function(x, index){
			
			if (index != this.currentThumbnail){
				this.getThumbnail(index).fadeIn('fast');
				this.getThumbnail(this.currentThumbnail).fadeOut('fast');
				this.thumbnails.find('.index').html(index);
				this.currentThumbnail = index;
			};
			
			this.thumbnails.css({
				left: x - this.thumbnails.width() / 2
			}).fadeIn();
		},
		
		hideThumbnails: function(){
			this.thumbnails.fadeOut();
		},
		
		getElement: function(index){
			return this.$el.find('.slide[data-index=' + index + ']');
		},
		
		getThumbnail: function(index){
			return this.thumbnails.find('.slide[data-index=' + index + ']');
		},
		
		play: function(){
			var that = this;
			that.isPlaying = true;
			that.interval = setInterval(function(){that.showNext()}, that.delay);
			$(this.playButton).addClass('pause').removeClass('play');
		},
		
		pause: function(){
			this.isPlaying = false;
			clearInterval(this.interval);
			this.Slider.index = 0;
			$(this.playButton).addClass('play').removeClass('pause');
		},
		
		showNext: function(){
			var next = this.current * 1 + 1;
			if (next <= this.collection.length) {
				this.navigate(next);
			}
			else{
				this.pause();	
			}
		}
	
	});
	
	return SlideShowView;
});
