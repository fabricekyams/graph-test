
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
    'scripts/directives/resultsDir.js',
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

        app.filter('toAn', function() {
            return function(input) {
                var an = parseInt(input);
                an = an/12;
                return an;
            };
        });

        

        app.filter('typeName', function() {
            return function(input) {
                var name;
                switch(input){
                    case 'A':
                        name = 'annuel';
                        break;
                    case 'C':
                        name= 'triennal';
                        break;
                    case 'E':
                        name = 'quinquennal';
                        break;

                }
                return name;
            };
        });

        app.filter('slice', function() {
          return function(arr, start, end) {
            return (arr || []).slice(start);
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
                $http.get('php/gets.php?data=all')
                .success(function(response) {
                    $scope.story='costum';
                    console.log(response);
                    $scope.refinancingOptions = ['fixe','1/1/1','3/3/3','5/5/5','10/5/5','12/5/5','15/5/5','20/5/5','7/3/3','8/3/3','9/3/3', '10/3/3','15/1/1','20/1/1','20/3/3','25/5/5','5/3/3','3/1/1','6/1/1'];
                    $scope.refinancing= new Refinancing(310000.00, 3.918 , 300 , new Date('01/31/2011'), new Date('01/31/2015'),2.08,response);
                    $http.get('php/gets.php?data=inds')
                    .success(function(response) {
                        $scope.refinancing.initMortgage.setRefTab(response);
                        $scope.refinancing.refMortgage.setRefTab(response);
                    console.log(response);
                        $scope.update();
                        $scope.initstory='reset';
                        $scope.refstory='reset';
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
                $scope.refinancing.initMortgage.story = $scope.story; 
                $scope.refinancing.refMortgage.story = $scope.story;
                $scope.refinancing.update(ref,duration,true);
                $scope.updateUi();    
            }

            $scope.updateInitType = function (ref , duration) {
                $scope.refinancing.initMortgage.refInd = $scope.refinancing.initMortgage.refInd.slice(0,1);
                $scope.refinancing.initMortgage.story = 'costum'; 
                $scope.refinancing.refMortgage.story = 'costum';
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

            $scope.updateWithIndPersRef = function (ref,duration) {
                $scope.refinancing.initMortgage.story = 'costum'; 
                $scope.refinancing.refMortgage.story = 'costum';
                $scope.refinancing.adjust(true);
                $scope.refinancing.update(ref,duration,true);
                $scope.updateUi(); 
            }

            $scope.updateWithIndPersInit = function (ref,duration) {
                $scope.refinancing.initMortgage.story = 'costum'; 
                $scope.refinancing.refMortgage.story = 'costum';
                $scope.refinancing.adjust(false);
                $scope.refinancing.update(ref,duration,true);
                $scope.updateUi(); 
            }
            $scope.updateSM = function (ref,duration){
                $scope.refinancing.refMortgage.sameMonthlyPayement =true;
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
             $scope.updateStoryInit = function  (story, ref,duration) {
               $scope.initstory = story;
               $scope.initializeStory(ref, story);
               $scope.refinancing.initMortgage.story = $scope.initstory; 
               $scope.refinancing.refMortgage.story = 'costum';
               $scope.refinancing.update(ref,duration,true);
               $scope.story = 'costum';
               $scope.refinancing.initMortgage.story = $scope.story; 
               $scope.updateUi();
           }

           $scope.updateStoryRef = function  (story, ref,duration) {
            $scope.refstory = story;
            $scope.initializeStory(ref, story);
            $scope.refinancing.initMortgage.story = 'costum'; 
            $scope.refinancing.refMortgage.story = $scope.refstory;
            $scope.refinancing.update(ref,duration,true);
            $scope.refinancing.refMortgage.story = $scope.story;
            $scope.updateUi();
        }


        $scope.updateStoryLimit = function  (ref) {
            $scope.initializeStory(ref, 'limit');
            if ((ref && $scope.refinancing.refMortgage.type.localeCompare('fixe')!==0) || (!ref && $scope.refinancing.initMortgage.type.localeCompare('fixe')!==0)) {
                $scope.refinancing.limitThenUpdate(ref);
                $scope.updateUi();
            };

        }

        $scope.initializeStory = function (ref, story) {
            if ( $scope.refinancing.refMortgage.type.localeCompare('fixe')!==0 &&  $scope.refinancing.initMortgage.type.localeCompare('fixe')!==0) {
                if ( $scope.refinancing.refMortgage.variation.type.localeCompare($scope.refinancing.initMortgage.variation.type)==0 ) {
                    $scope.refstory = story;
                    $scope.initstory = story;
                }else{
                    if (ref) {
                        $scope.refstory = story;

                    }else{
                        $scope.initstory = story;
                    };
                };
            }else{
                if (ref) {
                    $scope.refstory = story;

                }else{
                    $scope.initstory = story;
                };
                
            }
        }

        $scope.updateReset = function  (ref) {
            $scope.initializeStory(ref, 'reset');
            $scope.story = 'costum';
            if ((ref && $scope.refinancing.refMortgage.type.localeCompare('fixe')!==0) || (!ref && $scope.refinancing.initMortgage.type.localeCompare('fixe')!==0)) {
                $scope.refinancing.reset(ref,false);
                $scope.updateUi();
            };

        }



            /**
             * [updateUi description]
             * @return {[type]} [description]
             */
             $scope.updateUi = function(){
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
                var xtitle = 'Anneé';
                var ytitle = 'Montant';
                var interest = [];
                var capitalleft = [];
                var interestref = [];
                var capitalleftref = [];
                
                for(var i in  $scope.refinancing.initMortgage.amortizationParYears ){
                    interest[i] = $scope.round($scope.refinancing.initMortgage.amortizationParYears[i].interest);
                    capitalleft[i] = $scope.round($scope.refinancing.initMortgage.amortizationParYears[i].capital);
                }

                for(var i in  $scope.refinancing.refMortgage.amortizationParYears ){
                    interestref[i] = $scope.round($scope.refinancing.refMortgage.amortizationParYears[i].interest);
                    capitalleftref[i] = $scope.round($scope.refinancing.refMortgage.amortizationParYears[i].capital);
                }
                var series= [{
                    name: 'Interet',
                    data: interest,
                    stack: 'Actuel',
                    color: '#B8704D'
                }, {
                    name: 'Remboursement',
                    data: capitalleft,
                    stack: 'Actuel',
                    color: '#7A2900'
                }, {
                    name: 'Interet Rachat',
                    data: interestref,
                    stack: 'Rachat',
                    color: '#66A3FF'
                }, {
                    name: 'Remboursement Rachat',
                    data: capitalleftref,
                    stack: 'Rachat',
                    color: '#0052CC'
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
                $scope.round($scope.refinancing.initMortgage.totalCapitalIfRef),
                $scope.round($scope.refinancing.refMortgage.totalCapital)
                ];
                var interest = [
                $scope.round($scope.refinancing.initMortgage.totalInterestIfRef),
                $scope.round($scope.refinancing.refMortgage.totalInterest)
                ];
/*                var indem = [0, $scope.refinancing.indem ];
                var releaseCharges = [0, $scope.refinancing.releaseCharges ];
                var MGRegistration = [0, $scope.refinancing.MGRegistration ];*/
                var charges = [0, $scope.refinancing.fileCharges+$scope.refinancing.MGRegistration+$scope.refinancing.releaseCharges+$scope.refinancing.indem];

                var series= [
                {
                    name: 'Total Frais',
                    data: charges
                },   
                {
                    name: 'Interet',
                    data: interest,
                    color: '#FF0000'
                },
                {
                    name: 'Remboursement',
                    data: payment,
                    color: '#0099FF'
                }, 
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
                $scope.formatdivers = function (argument) {

                    var chart = {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            renderTo: 'chargesChart'

                        },
                        title: {
                            text: 'Repartition des charges'
                        },

                        series: [{
                            type: 'pie',
                            name: 'Browser share',
                            data: [
                            ['Frais de dossier',   $scope.round($scope.refinancing.fileCharges)],
                            ['Frais de mainLevée',  $scope.round($scope.refinancing.releaseCharges)],
                            {
                                name: 'Frais Hypothécaire',
                                y: $scope.round($scope.refinancing.MGRegistration),
                                sliced: true,
                                selected: true
                            },
                            ["Indemnité de remploi",   $scope.round($scope.refinancing.indem)]
                            ]
                        }]
                    }

                    $scope.idChart = 'chargesChart';

                    return chart;

                }

                $scope.formatindiceRef = function (argument) {

                    var interestref = [];
                    var capitalleftref = [];
                    var indiceref = [];

                    var start = $scope.refinancing.initMortgage.amortization.length - $scope.refinancing.durationLeft;
                    for(var i= 0; i<start; i++ ){
                        interestref[i] = 0;
                        capitalleftref[i] = 0;
                    }
                    for (var i = 0; i < $scope.refinancing.refMortgage.amortization.length; i++) {
                        interestref[i+start] = $scope.round($scope.refinancing.refMortgage.amortization[i].interest);
                        capitalleftref[i+start] = $scope.round($scope.refinancing.refMortgage.amortization[i].capital);
                    }

                    var refstart = $scope.refinancing.refMortgage.refTab.length - ($scope.refinancing.initMortgage.amortization.length-$scope.refinancing.durationLeft);

                    if ($scope.refinancing.refMortgage.type.localeCompare('fixe')!==0) {
                        var j = 0;
                        for (var i = refstart; i < $scope.refinancing.refMortgage.refTab.length; i++) {
                            indiceref[j] = $scope.refinancing.refMortgage.refTab[i][$scope.refinancing.refMortgage.variation.type];
                            j++;
                        };
                        if ($scope.refinancing.refMortgage.refInd.length>1) {
                            for (var i = 0; i < $scope.refinancing.refMortgage.refInd.length; i++) {
                                if (i==0) {
                                    var k=indiceref.length;
                                    for (var j = 0; j < $scope.refinancing.refMortgage.variation.fixe; j++) {
                                        indiceref[k] = $scope.refinancing.refMortgage.refInd[0].val;
                                        k++;
                                    };
                                }else{
                                    var rest = i==1? ($scope.refinancing.refMortgage.variation.fixe) :(((i-1)*$scope.refinancing.refMortgage.variation.reval)+$scope.refinancing.refMortgage.variation.fixe);
                                    if($scope.refinancing.refMortgage.duration -  rest < $scope.refinancing.refMortgage.variation.reval){
                                        var k=indiceref.length;
                                        for (var j = rest; j < $scope.refinancing.refMortgage.duration; j++) {
                                            indiceref[k] = $scope.refinancing.refMortgage.refInd[i].val;
                                            k++;
                                        };
                                    }else{
                                        var k=indiceref.length;
                                        for (var j = 0; j < $scope.refinancing.refMortgage.variation.reval; j++) {
                                            indiceref[k] = $scope.refinancing.refMortgage.refInd[i].val;
                                            k++
                                        };
                                    }

                                }
                            };
                        };


                    };

                    var chart = {
                        chart: {
                            zoomType: 'xy',
                            renderTo: 'indiceRefChart'

                        },
                        title: {
                            text: 'Indices - Remboursement (Rachat)'
                        },
                        plotOptions : {
                            area: {
                                stacking: 'normal',
                                marker: {
                                    enabled: false
                                }
                            },
                            spline: {
                                marker: {
                                    enabled: false
                                }
                            }

                        },
                        yAxis:[{
                            title: {
                                text: 'Remboursement',
                            }
                        },{
                            title: {
                                text: 'Indice',
                            }
                        }],
                        tooltip: {
                            shared: true
                        },
                        series: [ {
                            name: 'Interet Rachat',
                            type: 'area',
                            data: interestref,
                            stack: 'Rachat',
                            color: '#66A3FF',
                            yAxis: 1,
                            tooltip: {
                                valueSuffix: '€'
                            }
                        }, {
                            name: 'Remboursement Rachat',
                            type: 'area',
                            data: capitalleftref,
                            stack: 'Rachat',
                            color: '#0052CC',
                            yAxis: 1,
                            tooltip: {
                                valueSuffix: '€'
                            }
                        },

                        {
                            name: 'indice Rachat',
                            type: 'spline',
                            color: '#0F0500',
                            data: indiceref,
                            tooltip: {
                                valueSuffix: '%'
                            }
                        }]

                        


                    }

                    $scope.idChart = 'indiceRefChart';

                    return chart;

                }

                $scope.formatindiceInit = function (argument) {

                    var interest = [];
                    var capitalleft = [];
                    var indice = [];

                    for(var i in  $scope.refinancing.initMortgage.amortization ){
                        interest[i] = $scope.round($scope.refinancing.initMortgage.amortization[i].interest);
                        capitalleft[i] = $scope.round($scope.refinancing.initMortgage.amortization[i].capital);
                    }

                    var start = $scope.refinancing.initMortgage.amortization.length - $scope.refinancing.durationLeft;


                    var refstart = $scope.refinancing.refMortgage.refTab.length - ($scope.refinancing.initMortgage.amortization.length-$scope.refinancing.durationLeft);

                    if ($scope.refinancing.initMortgage.type.localeCompare('fixe')!==0) {
                        var j = 0;
                        for (var i = refstart; i < $scope.refinancing.initMortgage.refTab.length; i++) {
                            indice[j] = $scope.refinancing.initMortgage.refTab[i][$scope.refinancing.initMortgage.variation.type];
                            j++;
                        };
                        var initStart = $scope.refinancing.initMortgage.refInd.length - $scope.refinancing.initMortgage.getRefIndLength();
                        if (initStart>0 ) {
                            var k=indice.length;
                            var end;
                            if (indice.length< $scope.refinancing.initMortgage.variation.fixe) {
                               end =  $scope.refinancing.initMortgage.variation.fixe - indice.length;
                               for (var j = 0; j < end; j++) {
                                indice[k] = $scope.refinancing.initMortgage.refTab[$scope.refinancing.initMortgage.refTab.length-1][$scope.refinancing.initMortgage.variation.type];
                                k++;
                            };
                        }else{
                            var tmp = indice.length - $scope.refinancing.initMortgage.variation.fixe;
                            if (tmp > $scope.refinancing.initMortgage.variation.reval) {
                                end = tmp%$scope.refinancing.initMortgage.variation.reval ==0 ? $scope.refinancing.initMortgage.variation.reval : tmp%$scope.refinancing.initMortgage.variation.reval;
                                for (var j = 0; j < end; j++) {
                                    indice[k] = $scope.refinancing.initMortgage.refTab[$scope.refinancing.initMortgage.refTab.length-1][$scope.refinancing.initMortgage.variation.type];
                                    k++;
                                };

                            }else{
                                if (tmp < $scope.refinancing.initMortgage.variation.reval) {
                                 end =  $scope.refinancing.initMortgage.variation.reval - tmp;
                                 for (var j = 0; j < end; j++) {
                                    indice[k] = $scope.refinancing.initMortgage.refTab[$scope.refinancing.initMortgage.refTab.length-1][$scope.refinancing.initMortgage.variation.type];
                                    k++;
                                };

                            };
                        };
                    };
                    for (var i = initStart; i < $scope.refinancing.initMortgage.refInd.length; i++) {

                        var rest =(((i-1)*$scope.refinancing.initMortgage.variation.reval))+$scope.refinancing.initMortgage.variation.fixe;
                        if($scope.refinancing.initMortgage.duration -  rest < $scope.refinancing.initMortgage.variation.reval){
                            var k=indice.length;
                            for (var j = rest; j < $scope.refinancing.initMortgage.duration; j++) {
                                indice[k] = $scope.refinancing.initMortgage.refInd[i].val;
                                k++;
                            };
                        }else{
                            var k=indice.length;
                            for (var j = 0; j < $scope.refinancing.initMortgage.variation.reval; j++) {
                                indice[k] = $scope.refinancing.initMortgage.refInd[i].val;
                                k++
                            };
                        }


                    };
                };
            };


            var chart = {
                chart: {
                    zoomType: 'xy',
                    renderTo: 'indiceInitChart'

                },
                title: {
                    text: 'Indices - Remboursement Prêt Actuel'
                },
                plotOptions : {
                    area: {
                        stacking: 'normal',
                        marker: {
                            enabled: false
                        }
                    },
                    spline: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                yAxis:[{
                    title: {
                        text: 'Remboursement',
                    }
                },{
                    title: {
                        text: 'Indice',
                    }
                }],
                tooltip: {
                    shared: true
                },
                series: [{
                    name: 'Interet',
                    type: 'area',
                    data: interest,
                    stack: 'Actuel',
                    color: '#B8704D',
                    yAxis: 1,
                    tooltip: {
                        valueSuffix: '€'
                    }
                }, {
                    name: 'Remboursement',
                    type: 'area',
                    data: capitalleft,
                    stack: 'Actuel',
                    color: '#7A2900',
                    yAxis: 1,
                    tooltip: {
                        valueSuffix: '€'
                    }
                },
                {
                    name: 'Indice prêt actuel',
                    type: 'spline',
                    color: '#0F0500',
                    data: indice,
                    tooltip: {
                        valueSuffix: '%'
                    }
                }]




            }

            $scope.idChart = 'indiceInitChart';

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
                var srdref = [];
                var j =0;
                /*for(var i = $scope.refinancing.initMortgage.duration - $scope.refinancing.durationLeft; i< $scope.refinancing.initMortgage.amortization.length ;i++ ){
                    srd[j] = $scope.refinancing.initMortgage.amortization[i].SRD;
                    j++;
                }*/

                var j =0;
                for(var i = 0; i< $scope.refinancing.initMortgage.amortizationParYears.length ;i++ ){
                    srd[j] = $scope.round($scope.refinancing.initMortgage.amortizationParYears[i].SRD);
                    j++;
                }

                for(var i in  $scope.refinancing.refMortgage.amortizationParYears ){
                    srdref[i] = $scope.round($scope.refinancing.refMortgage.amortizationParYears[i].SRD);
                }
                var series= [{
                    name: 'Sole restant dû prêt Actuel',
                    data: srd,
                    color: '#005C1F'
                },
                {
                    name: 'Sole restant dû Rachat',
                    data: srdref,
                    color: '#0052CC'
                }
                ];
                var to = $scope.idChart = 'srdChart';
                var chart = $scope.chart(to, type, title, series, xtitle, ytitle);
                return chart;
            }

            $scope.formatmontly = function(){
                var type= 'line';
                var title = 'Solde Restant Dû';  
                var xtitle = 'mois';
                var ytitle = 'Montant';
                var srd = [];
                
                for(var i in  $scope.refinancing.refMortgage.amortization ){
                    srd[i] = $scope.round($scope.refinancing.refMortgage.amortization[i].SRD);
                }
                var series= [{
                    name: 'Sole restant dû prêt Actuel',
                    data: srd
                },
                {
                    name: 'Sole restant dû Rachat',
                    data: srdref
                }
                ];
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
             $scope.chart = function (to, type, title, series, xtitle, ytitle ) {
                var results = {
                    chart: {
                        renderTo: to,
                        type: type,
                        zoomType: 'xy',
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
                $scope.chargesChart = $scope.formatdivers();
                $scope.indiceRefChart = $scope.formatindiceRef();
                $scope.indiceInitChart = $scope.formatindiceInit();

            }

            $scope.round = function  (val) {
                return Math.round(val*100)/100;
                // body...
            }



            $scope.init();

        });



});




