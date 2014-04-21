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
      .when('consoles/:console', {
        templateUrl: 'views/console.html',
        controller: 'RecordsconsoleCtrl'
      })
      .when('consoles/:console/:game', {
        templateUrl: 'views/game.html',
        controller: 'RecordsgameCtrl'
      })
      .when('consoles/:console/:game/:level', {
        templateUrl: 'views/game.html',
        controller: 'RecordslevelCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
