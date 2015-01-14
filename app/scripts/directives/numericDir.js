/**
 * Module
 *
 * Parse strings Value Contained in range input to numeric for numeric input value
 */

define([
    'scripts/app'
    ],
    function (app) {
    'use strict';
   app.directive('toNumeric',function(){
   	return {
   		 restrict: 'M', // E = Element, A = Attribute, C = Class, M = Comment
   		link: function($scope, iElm, iAttrs, controller) {
   			$scope.$watch('financement.inputRate', function(newVal){
                $scope.financement.inputRate = parseFloat(newVal);
            });

            $scope.$watch('financement.inputDuration', function(newVal){
            	$scope.financement.inputDuration = parseInt(newVal);
        	});

        	$scope.$watch('financement.inputNewRate', function(newVal){
            	$scope.financement.inputNewRate= parseFloat(newVal);
        	});
   		}
   	};
   });

    /*app.directive('autoNumeric', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
                console.log(iElm.attr('id'));
                iElm.autoNumeric('init');
                $scope.$watch('financement.capital', function(newVal){
                   if(typeof($scope.financement.capital)=='string'){
                       $scope.financement.capital = parseFloat($scope.financement.capital.replace(/[,]/gim, ""));
                       console.log('je teste le string');
                   }
                       console.log('j update');

                    iElm.autoNumeric('update');
                   
                 });

            }
        };
    });
    */
});