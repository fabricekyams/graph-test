'use strict';

/**
*  Module
*
* Description
*/
define([
    'scripts/app',
    'highcharts'
    ],

    function (app,Highcharts) {
    'use strict';

	app.directive('ghVisualization', function(){
    	console.log(Highcharts);
		// Runs during compile
		var margin = 20,
	    width = 960,
	    height = 500 - .5 - margin



		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {
				val: '=',//,
				type: '=',
				field: '='
			}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			 restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			 //template: '<div id="{{ idChart }}" style="width:100%; height:400px;"></div>',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function(scope, element, attrs, controller) {
				    var a = 0;
	    			var b = 1;
	    			var chart ='';
				element.append('<div id="'+attrs.val+'" style="width:100%; height:400px;"></div>');
				//$canvas.attr('id', 'lol');
				//console.log(canvas);
				/*var chart = new Highcharts.Chart(scope.val);
				scope.$watch('val', function (newVal) {
						a+=1;
	                setTimeout(function(){
							if( a===b){
								for (var i = 0; i < chart.series.length; i++) {
									chart.series[i].setData(scope.val.series[i].data,false);
								};
								chart.redraw();
								a=0;
								b=1;
							}else{
								b+=1;
							}
	                },100);

				});*/
		
			}
		};
	});
});
