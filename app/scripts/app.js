'use strict';

/**
 * @ngdoc overview
 * @name graphTestApp
 * @description
 * # graphTestApp
 *
 * Main module of the application.
 */
angular.module('graphTestApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch', 
    'highcharts-ng',
    "ui.bootstrap",
    'ui.bootstrap.datepicker'

  ]).config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
