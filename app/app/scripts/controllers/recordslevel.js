'use strict';

angular.module('highscoreApp')
  .controller('RecordslevelCtrl', function ($scope, Records) {
    $scope.level = {};
    Records.getLevel()
      .success(function(data) {
        $scope.level = data;
      });
  });
