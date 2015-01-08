'use strict';

/**
 * @ngdoc function
 * @name graphTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the graphTestApp
 */

var graphTestApp = angular.module('graphTestApp');

graphTestApp.controller('MainCtrl',

  	function ($scope) {

        $scope.init = function (argument) {
            $scope.fund={};
            $scope.fund.amount = '250,000.00';
            $scope.fund.amountInt = 250000;
            $scope.fund.rate = 4.5;
            $scope.fund.duration = 36;
            var date = new Date();
            $scope.dt = date.toLocaleDateString(); 

             $scope.getAmortization();
             
             $scope.$watch('fund.amountInt', function(newVal){
                $scope.fund.amount = $scope.fund.amountInt;
                $scope.updateAmortization();
             });

              $scope.$watch('fund.rate', function(newVal){
                $scope.fund.rate = parseFloat(newVal);
                $scope.updateAmortization();
                //$scope.updateAmortization();

             });

               $scope.$watch('fund.duration', function(newVal){
                $scope.fund.duration = parseInt(newVal);
               $scope.updateAmortization();

             });
        }
        
        $scope.getAmortization = function () {
            var result = finance.calculateAmortization($scope.fund.amountInt, $scope.fund.duration, $scope.fund.rate, new Date($scope.dt) );
            $scope.InterestChart =  $scope.formatData(result, 'interest');
            $scope.srdChart =  $scope.formatData(result, 'srd');
            $scope.field = 'null';
        }

        $scope.updateAmortization = function (field, data) {
            var result = finance.calculateAmortization($scope.fund.amountInt, $scope.fund.duration, $scope.fund.rate, new Date($scope.dt) );
              $scope.formatData(result, 'interest');
              $scope.formatData(result, 'srd');
            $scope.InterestChart =  $scope.formatData(result, 'interest');
            $scope.srdChart =  $scope.formatData(result, 'srd');
            $scope.field = field;
            //console.log(result );

        }

        $scope.formatAmount = function (amount, destination) {
            
        }

        $scope.formatData = function (data, title) {

            var results = {};
            var categories = [];
            var series = [];
            var type = '';
            var graphTitle = '';
            var to = '';

            for (var i = 0; i < data.length; i++) {
                categories[categories.length] = i;
            };
            switch(title){
                case 'interest':
                    var interest = [];
                    var principle = [];
                    for (var i = 0; i < data.length; i++) {
                        interest[i] = data[i].paymentToInterest;
                        principle[i] = data[i].paymentToPrinciple;
                    };
                    series= [{
                        name: 'Interet',
                        data: interest,
                        color: '#FF0000'
                    }, {
                        name: 'Remboursement',
                        data: principle
                    }];
                    type = 'line';
                    graphTitle = 'Interêts';
                    to = $scope.idChart = 'InterestChart';

                    break;
                case 'srd':
                    var srd = [];
                    for (var i = 0; i < data.length; i++) {
                        srd[i] = data[i].principle;
                    };
                    series= [{
                        name: 'Solde Restant Dû',
                        data: srd
                    }];
                    type = 'line';
                    graphTitle = 'Solde Restant Dû';
                    to = $scope.idChart = 'srdChart';

                    break;
                default:
                    console.log('nothing');
                    break;
            }
            

            results = {
                chart: {
                    renderTo: to,
                    type: type,
                    animation: {
                        duration: 1000
                    }
                },
                title: {
                    text: graphTitle
                },
                xAxis: {
                    //categories: categories,
                    title: {
                        text: 'Mois'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Montant'
                    }
                },
                series: series
            }
            return results;


        }



        $scope.init();

}).directive('autoNumeric', function(){
    // Runs during compile
    return {
        //name: 'autoNumeric',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
         restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            console.log(iElm.attr('id'));
            iElm.autoNumeric('init');
            $scope.$watch('fund.amount', function(newVal){
               //iElm.autoNumeric('update');
               if(typeof($scope.fund.amount)=='string'){
                   $scope.fund.amountInt = parseFloat($scope.fund.amount.replace(/[,]/gim, ""));
               }else{
                   iElm.autoNumeric('update');
               }

               //$scope.updateAmortization();
             });


        }
    };
}).directive('datePicker', function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            iElm.datetimepicker({
               format:'d/m/Y',
                step:30,
                lang:'fr',
                timepicker:false,
                minDate: 0,
                defaultDate: new Date()
              });
        }
    };
});;




