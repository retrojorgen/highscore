'use strict';

angular.module('highscoreApp')
  .controller('RecordslevelCtrl', function ($scope, $routeParams, Records, Utilities) {

    $scope.getUrlUnfriendly = Utilities.getUrlUnfriendly;

    $scope.allToggle = false;
    if($routeParams.type === 'all')
      $scope.allToggle = true;

    $scope.description = {};
    $scope.description.level = $scope.getUrlUnfriendly($routeParams.level);
    $scope.description.game = $scope.getUrlUnfriendly($routeParams.game);
    $scope.description.console = $scope.getUrlUnfriendly($routeParams.console);


    $scope.levelDetails = {
      'level': Utilities.getUrlUnfriendly($routeParams.level),
      'game': Utilities.getUrlUnfriendly($routeParams.game),
      'console': Utilities.getUrlUnfriendly($routeParams.console)
    };



    Records.getLevel($routeParams.console, $routeParams.game, $routeParams.level, $scope.allToggle)
      .success(function(data) {
        $scope.level = data;
        console.log(data);
      });
  });
