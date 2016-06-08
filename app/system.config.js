System.config({
	 transpiler: 'traceur',
	map: {
		angular: '../node_modules/angular/angular.js',
		'ngComponentRouter': '../node_modules/@angular/router/angular1/angular_1_router.js',
		'ngSanitize': 	"../node_modules/angular-sanitize/angular-sanitize.js", 
		 traceur: '../node_modules/traceur/bin/traceur.js',
		 'd3': '../node_modules/d3/d3.js',
		 Leaflet: '../node_modules/leaflet/dist/leaflet.js'
	},
	 meta: {
    	'angular'	: {format: 'global', exports: 'angular'},
    	'ngComponentRouter'	:  {format: 'global', deps: ['angular']}
	}

})
