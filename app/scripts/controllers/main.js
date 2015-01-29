
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

    
    app.filter('abs', function() {
        return function(input) {
        return (input.replace('-', ''));
  };
});
    app.controller('MainCtrl',

      	function ($scope, $http, $q, Refinancing) {
            /**
             * in
             * @param  {[type]}
             * @return {[type]}
             */
            $scope.init = function (argument) {
              /*   $scope.InterestChart=2;
                $scope.srdChart=3 ;
                $scope.compChart=4 ;*/
                $http.get('php/gets.php/?data=all')
                .success(function(response) {
                    $scope.story='max';
                    $scope.refinancingOptions = ['fixe','1/1/1','3/3/3','5/5/5','10/5/5','12/5/5','15/5/5','20/5/5','7/3/3','8/3/3','9/3/3', '10/3/3','15/1/1','20/1/1','20/3/3','25/5/5','5/3/3','3/1/1','6/1/1'];
                    $scope.refinancing= new Refinancing(310000.00, 2.918 , 120 , new Date('02/31/2011'), new Date('01/31/2015'),2,response);
                    $scope.update();
                    console.log($scope.refinancing);
                    $http.get('php/gets.php/?data=inds')
                    .success(function(response) {
                        $scope.refinancing.initMortgage.setRefTab(response);
                        $scope.refinancing.refMortgage.setRefTab(response);
                    });
                });



               // $scope.refinancing.update(true);

                //$scope.getAmortization();
                 
                
            }

            /**
             * [update description]
             * @param  {[type]} ref      [description]
             * @param  {[type]} duration [description]
             * @return {[type]}          [description]
             */
            $scope.update = function (ref , duration) {
                $scope.refinancing.update(ref,duration,true);
                $scope.updateUi();    
            }

            /**
             * [updateWithIndPers description]
             * @param  {[type]} ref      [description]
             * @param  {[type]} duration [description]
             * @return {[type]}          [description]
             */
            $scope.updateWithIndPers = function (ref,duration) {
                $scope.refinancing.initMortgage.story = 'costum'; 
                $scope.refinancing.refMortgage.story = 'costum';
                $scope.refinancing.update(ref,duration,true);
                $scope.updateUi(); 
            }

            /**
             * [updateVarWithDurationFirst description]
             * @param  {[type]} ref      [description]
             * @param  {[type]} duration [description]
             * @return {[type]}          [description]
             */
            $scope.updateVarWithDurationFirst = function (ref,duration) {
                $scope.refinancing.update(ref,duration,true);
                $scope.updateUi(); 
            }

            /**
             * [updateVarWithTypeFirst description]
             * @param  {[type]} ref      [description]
             * @param  {[type]} duration [description]
             * @return {[type]}          [description]
             */
            $scope.updateVarWithTypeFirst = function (ref,duration) {
                $scope.refinancing.update(ref,duration,false);
                $scope.updateUi(); 
            }

            /**
             * [updateStory description]
             * @param  {[type]} ref      [description]
             * @param  {[type]} duration [description]
             * @return {[type]}          [description]
             */
            $scope.updateStory = function  (ref,duration) {
                $scope.refinancing.initMortgage.story = $scope.story; 
                $scope.refinancing.refMortgage.story = $scope.story;
                $scope.refinancing.update(ref,duration,true);
                $scope.updateUi();
            }

            /**
             * [updateUi description]
             * @return {[type]} [description]
             */
            $scope.updateUi = function(){
                console.log($scope.refinancing);
                $scope.monthDiff = $scope.calculMonthDiff() ;
                $scope.TotalDiff = $scope.calculTotalDiff();
                $scope.isTotalBeneficial = $scope.calculIsTotalBeneficial() ? "D'avantage" : "De désavantage";
                $scope.ismonthlyBeneficial = $scope.calculIsMonthlyBeneficial() ? "D'avantage" : "De désavantage";
                $scope.isBeneficial = $scope.calculIsTotalBeneficial() ? "Avantageux" : "Désavantageux";
                $scope.formatDataGraph(); 
            }

            /**
             * [calculMonthDiff description]
             * @return {[type]} [description]
             */
            $scope.calculMonthDiff = function () {
                return $scope.refinancing.initMortgage.monthlyPayment - $scope.refinancing.refMortgage.monthlyPayment;
            }

            /**
             * [calculTotalDiff description]
             * @return {[type]} [description]
             */
            $scope.calculTotalDiff = function () {
                return ($scope.refinancing.initMortgage.totalPaymentIfRef) - $scope.refinancing.refMortgage.totalPayment;
            }

            /**
             * [calculIsMonthlyBeneficial description]
             * @return {[type]} [description]
             */
            $scope.calculIsMonthlyBeneficial = function () {
                var benef = ($scope.monthDiff > 0);
                $scope.refinancing.refMortgage.isMonthlyBeneficial = benef;
                return benef;
            }

            /**
             * [calculIsTotalBeneficial description]
             * @return {[type]} [description]
             */
            $scope.calculIsTotalBeneficial = function () {
                var benef = ($scope.TotalDiff > 0);
                $scope.refinancing.refMortgage.isTotalBeneficial = benef;
                return benef;
            }

            /**
             * [formatInterest description]
             * @param  {[type]} argument [description]
             * @return {[type]}          [description]
             */
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

            /**
             * [formatcomp description]
             * @param  {[type]} argument [description]
             * @return {[type]}          [description]
             */
            $scope.formatcomp = function (argument) {
                var type= 'column';
                var title = 'difference ';  
                var xtitle = 'Financement';
                var ytitle = 'Montant';
                var payment = [
                    $scope.refinancing.initMortgage.totalCapitalIfRef,
                    $scope.refinancing.refMortgage.totalCapital
                ];
                var interest = [
                    $scope.refinancing.initMortgage.totalInterestIfRef,
                    $scope.refinancing.refMortgage.totalInterest
                ];
                var indem = [0, $scope.refinancing.indem ];
                var charges = [0, $scope.refinancing.fileCharges];

                var series= [
                {
                    name: 'frais de dossier',
                    data: charges
                },
                {
                    name: 'indemnité de main levé',
                    data: indem
                }, 
                {
                    name: 'interest',
                    data: interest,
                    color: '#FF0000'
                },
                {
                    name: 'Remboursement',
                    data: payment,
                    color: '#0099FF'
                } 
                ];
                var to = $scope.idChart = 'compChart';
                var chart = $scope.chart(to, type, title, series, xtitle, ytitle);
                chart.plotOptions = {
                    column: {
                        stacking: 'normal'}
                };

                chart.xAxis.categories=['prêt actuel' , 'rachat']
                return chart;

            }

            /**
             * [formatSRD description]
             * @return {[type]} [description]
             */
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


            /**
             * [chart description]
             * @param  {[type]} to     [description]
             * @param  {[type]} type   [description]
             * @param  {[type]} title  [description]
             * @param  {[type]} series [description]
             * @param  {[type]} xtitle [description]
             * @param  {[type]} ytitle [description]
             * @return {[type]}        [description]
             */
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
                return results;
            }

            /**
             * [formatDataGraph description]
             * @param  {[type]} data  [description]
             * @param  {[type]} title [description]
             * @return {[type]}       [description]
             */
            $scope.formatDataGraph = function (data, title) {
                $scope.InterestChart = $scope.formatInterest();
                $scope.srdChart = $scope.formatSRD();
                $scope.compChart = $scope.formatcomp();

            }



            $scope.init();

    });

    
    
});




