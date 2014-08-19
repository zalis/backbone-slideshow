require.config({

	paths: {
		'text': 'libs/require/text',
		'json': 'libs/require/json',
		'css': 'libs/require/css',
		'jquery': 'libs/jquery/jquery-1.11.0.min',
		'underscore': 'libs/underscore/lodash',
		'backbone': 'libs/backbone/backbone'
	},

	shim: {
		'backbone': {
			'deps': ['jquery', 'underscore'],
			'exports': 'Backbone'
		}
	}

});

require([
	'router'
], function(Router) {
	
		this.router = new Router();


});