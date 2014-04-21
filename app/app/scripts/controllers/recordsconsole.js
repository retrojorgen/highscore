'use strict';

angular.module('highscoreApp')
  .controller('RecordsconsoleCtrl', function ($scope, Records, $routeParams) {
    $scope.console = {};
    Records.getConsole()
      .success(function(data) {
        $scope.console = data;
      });
  });
