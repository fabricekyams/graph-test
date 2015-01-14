/**
 * Module
 *
 * All jquery plugins
 */

define([
    'scripts/app'
    ],

    function (app) {
    'use strict';

    /**
     * Show date table picker.
     * Maximum day is today
     */
    app.directive('beforeToday', function(){
        return {
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {
                iElm.datetimepicker({
                   format:'d/m/Y',
                    step:30,
                    lang:'fr',
                    timepicker:false,
                    maxDate: 0,
                    defaultDate: new Date()
                  });
            }
        };
    });

    /**
     * Show date table picker.
     * Maximum day is today
     */
    app.directive('afterToday', function(){
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