'use strict';

/**
 * @ngdoc function
 * @name graphTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the graphTestApp
 */
angular.module('graphTestApp')
  .controller('MainCtrl', 

  	function ($scope) {

  		$scope.fund = new Quantity()
    
	    $scope.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];


  });

function Quantity() {
    var amount = 250000;
    var rate = 2.5;
    var duration = 20;

    

    this.__defineGetter__("amount", function () {
        return amount;
    });

    this.__defineSetter__("amount", function (val) {        
        val = parseInt(val);
        amount = val;
        //dozens = val / 12;
    });

    this.__defineGetter__("rate", function () {
        return rate;
    });

    this.__defineSetter__("rate", function (val) {        
        val = parseFloat(val);
        rate = val;
        //dozens = val / 12;
    });

    this.__defineGetter__("duration", function () {
        return duration;
    });

    this.__defineSetter__("duration", function (val) {        
        val = parseInt(val);
        duration = val;
        //dozens = val / 12;
    });
}