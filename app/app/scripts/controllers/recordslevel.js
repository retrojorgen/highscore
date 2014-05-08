'use strict';

angular.module('highscoreApp')
  .controller('RecordslevelCtrl', function ($scope, $routeParams, Records, Utilities) {

    $scope.levelDetails = {
      'level': Utilities.getUrlUnfriendly($routeParams.level),
      'game': Utilities.getUrlUnfriendly($routeParams.game),
      'console': Utilities.getUrlUnfriendly($routeParams.console)
    };

    $scope.getUrlUnfriendly = Utilities.getUrlUnfriendly;

    Records.getLevel($routeParams.console, $routeParams.game, $routeParams.level, true)
      .success(function(data) {
        $scope.level = data;
        console.log(data);
      });
  });
