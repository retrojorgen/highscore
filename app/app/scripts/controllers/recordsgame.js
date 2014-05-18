'use strict';

angular.module('highscoreApp')
  .controller('gameCtrl', function ($scope, Records, Utilities, $routeParams) {
    console.log($routeParams);
    $scope.routeParams = $routeParams;
    $scope.levels = [];
    $scope.records = [];

    $scope.gameDetails = {
      'game': Utilities.getUrlUnfriendly($routeParams.game),
      'console': Utilities.getUrlUnfriendly($routeParams.console)
    };

    $scope.gameRecords = {};
    Records.getGame($routeParams.console, $routeParams.game)
      .success(function(data) {
        $scope.records = data;
        _.each($scope.records, function(record) {
          $scope.levels.push(record.level);
        });

        $scope.levels = _.unique($scope.levels);

      });

    $scope.getRecordTime = Utilities.getRecordTime;
    $scope.getRecordImageSize = Utilities.getRecordImageSize;
    $scope.getUrlFriendly = Utilities.getUrlFriendly;
  });
