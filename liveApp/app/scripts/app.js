'use strict';

angular
  .module('highscoreApp', [
    'ngRoute',
    'ui.bootstrap',
    'ngAnimate'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/live/:console/:game/:level/:type', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/record', {
        templateUrl: 'views/newrecord.html',
        controller: 'newRecordCtrl'
      })
      .when('/record/:console/:game/:level', {
        templateUrl: 'views/newrecord.html',
        controller: 'newRecordCtrl'
      })
      .otherwise({
        redirectTo: '/live'
      });
  });
