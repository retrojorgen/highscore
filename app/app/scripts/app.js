'use strict';

angular
  .module('highscoreApp', [
    'ngRoute',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/record', {
        templateUrl: 'views/record.html',
        controller: 'RecordCtrl'
      })
      .when('/approve', {
        templateUrl: 'views/approve.html',
        controller: 'ApproveCtrl'
      })
      .when('/records/:console/:game/:level', {
        templateUrl: 'views/level.html',
        controller: 'RecordslevelCtrl'
      })
      .when('/records/:console/:game/:level/:type', {
        templateUrl: 'views/level.html',
        controller: 'RecordslevelCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
