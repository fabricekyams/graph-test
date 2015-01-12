
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
    '../vendors/autonumeric/autoNumeric.js',
    'scripts/models/Financement.js',
    'datetimepicker',
    'scripts/directives/chart.js'
    ],

    function (app,finance,DC) {
    'use strict';
    app.controller('MainCtrl',

      	function ($scope, Financement) {
            console.log('TAUX:                 ',Math.pow(1 + 0.0228, 1 / 12) - 1);
            console.log('Indemnité remploie:   ',196580.68 * 0.0018804294971668245 * 3);
            console.log('mensualité 1€:        ',DC.CreditUtil.calculMensualite( 0.0018804294971668245, 72));
            console.log('mensualité   :        ',DC.CreditUtil.calculMensualite( 0.0018804294971668245, 72)*198326.06);
            console.log('Capital total payé:   ',DC.CreditUtil.calculMensualite( 0.0018804294971668245, 72)*198326.06*72);
            console.log(DC.CreditUtil.calculMensualite( 0.0018804294971668245, 72));
            console.log('SRD:                   ',DC.CreditUtil.calculCapitalWithMensualite( 0.0018804294971668245, 72, 12, 0.014863347794026729)*198326.06);
            console.log('SRD:                   ',DC.CreditUtil.calculCapital( 0.0018804294971668245, 72, 12)*198326.06);
            $scope.financement = new Financement(198326.06, 2.28, 72,new Date(), new Date('1/13/2016'));
            $scope.financement.init();
            console.log('durationLeft: ', $scope.financement);

            /**
             * in
             * @param  {[type]}
             * @return {[type]}
             */
            $scope.init = function (argument) {
                $scope.inputs={};
                $scope.inputs.amount = 250000.00;
                $scope.inputs.amountInt = 250000.00;
                $scope.inputs.rate = 4.5;
                $scope.inputs.rateM = Math.pow(1 + 0.045, 1 / 12) - 1;
                $scope.inputs.duration = 120;

                var date = new Date();
                $scope.dt = date.toLocaleDateString();
                
                 $scope.getAmortization();
                 
                $scope.$watch('inputs.amount', function(newVal){
                    console.log("ok");
                    $scope.updateAmortization();
                 });

                  $scope.$watch('inputs.rate', function(newVal){
                    $scope.inputs.rate = parseFloat(newVal);
                    $scope.updateAmortization();
                    //$scope.updateAmortization();

                 });

                   $scope.$watch('inputs.duration', function(newVal){
                    $scope.inputs.duration = parseInt(newVal);
                   $scope.updateAmortization();

                 });
            }
            
            $scope.getSRD = function (argument) {
                
                // body...
            }
            $scope.getAmortization = function () {
                var result = finance.calculateAmortization($scope.inputs.amount, $scope.inputs.duration, $scope.inputs.rate, new Date($scope.dt) );
                $scope.InterestChart =  $scope.formatData(result, 'interest');
                $scope.srdChart =  $scope.formatData(result, 'srd');
                $scope.field = 'null';
            }

            $scope.updateAmortization = function (field, data) {
                var result = finance.calculateAmortization($scope.inputs.amount, $scope.inputs.duration, $scope.inputs.rate, new Date($scope.dt) );
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
    app.directive('autoNumeric', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
                console.log(iElm.attr('id'));
                iElm.autoNumeric('init');
                $scope.$watch('inputs.amount', function(newVal){
                   if(typeof($scope.inputs.amount)=='string'){
                       $scope.inputs.amount = parseFloat($scope.inputs.amount.replace(/[,]/gim, ""));
                       console.log('je teste le string');
                   }
                       console.log('j update');

                    iElm.autoNumeric('update');
                   
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




