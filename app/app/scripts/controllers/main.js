'use strict';

angular.module('highscoreApp')
  .controller('MainCtrl', function ($scope, Records, Utilities) {
    $scope.records = [];

    Records.getAllRecords()
      .success(function(data) {
        $scope.records = data;
        console.log(data);
      });

    $scope.getUrlFriendly = Utilities.getUrlFriendly;
  });
