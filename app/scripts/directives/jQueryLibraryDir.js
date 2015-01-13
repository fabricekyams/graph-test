define([
    'scripts/app'
    ],

    function (app) {
    'use strict';
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