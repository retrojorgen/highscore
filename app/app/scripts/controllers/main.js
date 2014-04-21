'use strict';

angular.module('highscoreApp')
  .controller('MainCtrl', function ($scope, Records, Utilities) {
    $scope.newest = {};
    $scope.best = {};
    $scope.worst = {};

    Records.getAllRecords()
      .success(function(data) {
        $scope.newest = data.newest;
        $scope.best = data.best;
        $scope.worst = data.worst;
      });

    $scope.getRecordImageSize = Utilities.getRecordImageSize;
    $scope.getRecordTime = Utilities.getRecordTime;
    $scope.getUrlFriendly = Utilities.getUrlFriendly;
  });
