'use strict';

angular.module('highscoreApp')
  .controller('RecordsgameCtrl', function ($scope, Records, Utilities, $routeParams) {
    console.log($routeParams);
    $scope.gameRecords = {};
    Records.getGameRecords()
      .success(function(data) {
        $scope.gameRecords = data;
      });

    $scope.getRecordTime = Utilities.getRecordTime;
    $scope.getRecordImageSize = Utilities.getRecordImageSize;
  });
