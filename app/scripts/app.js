'use strict';

/**
 * @ngdoc overview
 * @name graphTestApp
 * @description
 * # graphTestApp
 *
 * Main module of the application.
 */

define([
  'angularAMD',
  'angular-route',
  'angular-cookies',
  'angular-resource',
  'angular-sanitize',
  'angular-touch',
  'jquery',
  'ss',
  'shim',
  'highcharts'
   ], function (angularAMD) {
  var app = angular.module('graphTestApp', [
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch' 

    ]);
  app.config(function ($routeProvider) {
      $routeProvider
        .when('/main', angularAMD.route( {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerUrl: 'scripts/controllers/main'
        }))
        .when('/about', angularAMD.route( {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl',
          controllerUrl: 'scripts/controllers/about'
        }))
        .otherwise( {
          redirectTo: '/main'
        });
      
    });

    return angularAMD.bootstrap(app);
});
