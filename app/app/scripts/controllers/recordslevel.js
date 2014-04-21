'use strict';

angular.module('highscoreApp')
  .controller('RecordslevelCtrl', function ($scope, Records, Utilities, $routeParams) {
    $scope.level = {};
    Records.getLevel()
      .success(function(data) {
        $scope.level = data;
      });
  });
