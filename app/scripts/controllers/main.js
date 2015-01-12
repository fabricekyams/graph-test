
/**
 * @ngdoc function
 * @name graphTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the graphTestApp
 */
define([
    'scripts/app',
    '../vendors/finance/finance.js',
    'datetimepicker',
    '../vendors/autonumeric/autoNumeric.js',
    'http://code.highcharts.com/highcharts.js',
    'scripts/directives/chart.js'
    ],

    function (app,finance) {
    'use strict';

    app.controller('MainCtrl',

      	function ($scope) {
            console.log("okok");
            /**
             * in
             * @param  {[type]}
             * @return {[type]}
             */
            $scope.init = function (argument) {
               $scope.fund={};
    /*          $scope.fund.amount = '250,000.00';
                $scope.fund.amountInt = 250000;
                $scope.fund.rate = 4.5;
                $scope.fund.duration = 36;
                var date = new Date();
                $scope.dt = date.toLocaleDateString(); */

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
                        type = 'column';
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

    });
    app.directive('autoNumeric', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
                console.log(iElm.attr('id'));
                iElm.autoNumeric('init');
                iElm.keypress(function  (argument) {
                    console.log($scope.fund.amount);
                   if(typeof($scope.fund.amount)=='string'){
                       $scope.fund.amountInt = parseFloat($scope.fund.amount.replace(/[,]/gim, ""));
                   }else{
                       iElm.autoNumeric('update');
                   }
                })
                $scope.$watch('fund.amount', function(newVal){
                   //iElm.autoNumeric('update');
                   if(typeof($scope.fund.amount)=='string'){
                       $scope.fund.amountInt = parseFloat($scope.fund.amount.replace(/[,]/gim, ""));
                   }else{
                       iElm.autoNumeric('update');
                   }
                 });

            }
        };
    });
    app.directive('datePicker', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
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
    });
});




