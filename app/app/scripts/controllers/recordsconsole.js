'use strict';

angular.module('highscoreApp')
  .controller('RecordsconsoleCtrl', function ($scope, Records) {
    $scope.console = {};
    Records.getConsole()
      .success(function(data) {
        $scope.console = data;
      });
  });
