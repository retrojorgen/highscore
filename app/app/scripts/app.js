'use strict';

angular
  .module('highscoreApp', [
    'ngRoute'
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
      .when('/consoles', {
        templateUrl: 'views/consoles.html',
        controller: 'ConsolesCtrl'
      })
      .when('/consoles/:console', {
        templateUrl: 'views/consoles.html',
        controller: 'ConsolesCtrl'
      })
      .when('/consoles/:console/:game', {
        templateUrl: 'views/game.html',
        controller: 'RecordsgameCtrl'
      })
      .when('/consoles/:console/:game/:level', {
        templateUrl: 'views/level.html',
        controller: 'RecordslevelCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
