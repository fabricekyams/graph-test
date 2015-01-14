
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
    'DocteurCreditJS',
    '../vendors/DocteurCredit/taux.js',
    'scripts/directives/autoNumericFabrice.js',
    'scripts/models/Refinancing.js',
    'scripts/models/Financementbeta.js',
    'datetimepicker',
    'scripts/directives/chartDir.js',
    'scripts/directives/jQueryLibraryDir.js',
    'scripts/directives/numericDir.js'
    ],

    function (app,finance,DC) {
    'use strict';
    app.controller('MainCtrl',

      	function ($scope, Refinancing) {
            /**
             * in
             * @param  {[type]}
             * @return {[type]}
             */
            $scope.init = function (argument) {
                $scope.financementOptions = ['fixe','1/1/1','3/3/3','5/5/5','10/5/5','12/5/5','15/5/5','20/5/5','7/3/3','8/3/3','9/3/3', '10/3/3','15/1/1','20/1/1','20/3/3','25/5/5','5/3/3','3/1/1','6/1/1'];
                $scope.financement= new Refinancing(310000.00, 2.918 , 120 , new Date('01/31/2011'), new Date('01/31/2015'),2.28);
                console.log($scope.financement);

                //$scope.getAmortization();
                 
                
            }

            $scope.update = function  (argument) {
                $scope.financement.update();
                //console.log($scope.financement);
            }

            $scope.getAmortization = function () {
                var result = finance.calculateAmortization($scope.financement.amount, $scope.financement.duration, $scope.financement.rate, new Date($scope.dt) );
                $scope.InterestChart =  $scope.formatData(result, 'interest');
                $scope.srdChart =  $scope.formatData(result, 'srd');
                $scope.field = 'null';
            }

            $scope.updateAmortization = function (field, data) {
                var result = finance.calculateAmortization($scope.financement.amount, $scope.financement.duration, $scope.financement.rate, new Date($scope.dt) );
                  $scope.formatData(result, 'interest');
                  $scope.formatData(result, 'srd');
                $scope.InterestChart =  $scope.formatData(result, 'interest');
                $scope.srdChart =  $scope.formatData(result, 'srd');
                $scope.field = field;
                //console.log(result);

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

    app.filter('mul', function() {
        return function(input) {
        return input *2;
  };
});
    
    
});




