
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
    //'scripts/models/Financementbeta.js',
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
                $scope.refinancingOptions = ['fixe','1/1/1','3/3/3','5/5/5','10/5/5','12/5/5','15/5/5','20/5/5','7/3/3','8/3/3','9/3/3', '10/3/3','15/1/1','20/1/1','20/3/3','25/5/5','5/3/3','3/1/1','6/1/1'];
                $scope.refinancing= new Refinancing(310000.00, 2.918 , 120 , new Date('01/31/2011'), new Date('01/31/2015'),2.28);
                $scope.update();
               // $scope.refinancing.update(true);

                //$scope.getAmortization();
                 
                
            }

            $scope.update = function (duration=false) {
                $scope.refinancing.update($scope.sameMonthlyPayement,duration);
                $scope.monthDiff = $scope.calculMonthDiff() ;
                $scope.TotalDiff = $scope.calculTotalDiff();
                $scope.isTotalBeneficial = $scope.calculIsTotalBeneficial() ? "D'avantage" : "De désavantage";
                $scope.ismonthlyBeneficial = $scope.calculIsMonthlyBeneficial() ? "D'avantage" : "De désavantage";
                $scope.isBeneficial = $scope.calculIsTotalBeneficial() ? "Avantageux" : "Désavantageux";
                $scope.formatDataGraph();
                console.log($scope.refinancing);
            }
            $scope.calculMonthDiff = function () {
                return $scope.refinancing.initMortgage.monthlyPayment - $scope.refinancing.refMortgage.monthlyPayment;
            }
            $scope.calculTotalDiff = function () {
                console.log($scope.refinancing.initMortgage.totalPayement);
                console.log($scope.refinancing.refMortgage.totalPayement);
                return ($scope.refinancing.initMortgage.monthlyPayment *  $scope.refinancing.durationLeft) - $scope.refinancing.refMortgage.totalPayement;
            }
            $scope.calculIsMonthlyBeneficial = function () {
                var benef = ($scope.monthDiff > 0);
                $scope.refinancing.refMortgage.isMonthlyBeneficial = benef;
                return benef;
            }
            $scope.calculIsTotalBeneficial = function () {
                var benef = ($scope.TotalDiff > 0);
                $scope.refinancing.refMortgage.isTotalBeneficial = benef;
                return benef;
            }
            $scope.formatInterest = function (argument) {
                var type= 'column';
                var title = 'Interets et capital payé';  
                var xtitle = 'mois';
                var ytitle = 'Montant';
                var interest = [];
                var capitalleft = [];
                
                for(var i in  $scope.refinancing.refMortgage.amortization ){
                    interest[i] = $scope.refinancing.refMortgage.amortization[i].interest;
                    capitalleft[i] = $scope.refinancing.refMortgage.amortization[i].capital;
                }
                var series= [{
                    name: 'Interet',
                    data: interest,
                    color: '#FF0000'
                }, {
                    name: 'Remboursement',
                    data: capitalleft
                }];
                var to = $scope.idChart = 'InterestChart';
                var chart = $scope.chart(to, type, title, series, xtitle, ytitle);
                chart.plotOptions = {
                    column: {
                        stacking: 'normal'}
                }
                return chart;

            }
            $scope.formatdiff = function (argument) {
                var type= 'column';
                var title = 'difference ';  
                var xtitle = 'Financement';
                var ytitle = 'Montant';
                var payment = [
                    $scope.refinancing.initMortgage.getTotalCapitalFromPeriode($scope.refinancing.durationLeft),
                    $scope.refinancing.initMortgage.
                ];
                var interet = [];
                var indem = [];
                var charges = [];


                
                for(var i in  $scope.refinancing.refMortgage.amortization ){
                    interest[i] = $scope.refinancing.refMortgage.amortization[i].interest;
                    capitalleft[i] = $scope.refinancing.refMortgage.amortization[i].capital;
                }
                var series= [{
                    name: 'Interet',
                    data: interest
                }, {
                    name: 'Remboursement',
                    data: capitalleft
                },{
                    name: 'indemnité de main levé',
                    data: interest
                }, {
                    name: 'frais de dossier',
                    data: capitalleft
                }];
                var to = $scope.idChart = 'InterestChart';
                var chart = $scope.chart(to, type, title, series, xtitle, ytitle);
                chart.plotOptions = {
                    column: {
                        stacking: 'normal'}
                };
                chart.xAxis.categories=['prêt actuel' , 'rachat']
                return chart;

            }

            $scope.formatSRD = function(){
                var type= 'line';
                var title = 'Solde Restant Dû';  
                var xtitle = 'mois';
                var ytitle = 'Montant';
                var srd = [];
                
                for(var i in  $scope.refinancing.refMortgage.amortization ){
                    srd[i] = $scope.refinancing.refMortgage.amortization[i].SRD;
                }
                var series= [{
                    name: 'Sole restant dû',
                    data: srd
                }];
                var to = $scope.idChart = 'srdChart';
                var chart = $scope.chart(to, type, title, series, xtitle, ytitle);
                return chart;
            }



            $scope.chart = function (to, type, title, series, xtitle, ytitle) {
                var results = {
                    chart: {
                        renderTo: to,
                        type: type,
                        animation: {
                            duration: 1000
                        }
                    },
                    title: {
                        text: title
                    },
                    xAxis: {
                        //categories: categories,
                        title: {
                            text: xtitle
                        }
                    },
                    yAxis: {
                        title: {
                            text: ytitle
                        }
                    },
                    series: series
                }
                console.log(results);
                return results;
            }

            $scope.formatDataGraph = function (data, title) {
                $scope.InterestChart = $scope.formatInterest()
                $scope.srdChart = $scope.formatSRD()
                
                /*var results = {};
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
                return results;*/


            }



            $scope.init();

    });

    app.filter('abs', function() {
        return function(input) {
        return (input.replace('-', ''));
  };
});
    
    
});




