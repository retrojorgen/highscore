'use strict';

angular.module('highscoreApp')
  .controller('ConsolesCtrl', function ($scope, $routeParams, Utilities, Records) {
    console.log($routeParams);
    $scope.consoles = [];

    Records.getConsoles()
      .success(function(data) {
        $scope.consoles = data;
      });

    $scope.getUrlFriendly = Utilities.getUrlFriendly;
  });