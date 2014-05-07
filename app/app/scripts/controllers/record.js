'use strict';

angular.module('highscoreApp')
  .controller('RecordCtrl', function ($scope, Records) {
    $scope.record = {};
    $scope.record.images = [];
    $scope.uploadme = {};
    $scope.uploadme.src = '';
    $scope.levels = [];
    $scope.levelsList = [];
    $scope.games = [];
    $scope.consoles = [];
    $scope.recordType = [
      'shortestTime',
      'longestTime',
      'highestScore',
      'lowestScore'
    ];

    $scope.lap = [
      'round',
      'track',
      'game'
    ];

    Records.getLevels()
      .success(function ( data ) {
        $scope.levels = data;
        _.each($scope.levels, function(level) {
          $scope.games.push(level.game);
          $scope.consoles.push(level.console);
          $scope.levelsList.push(level.level);
        });
        $scope.games = _.uniq($scope.games);
        $scope.consoles = _.uniq($scope.consoles);
        $scope.levelsList = _.uniq($scope.levelsList);
      });

    $scope.images = [];

    $scope.addImage = function ( imageSrc ) {
      $scope.record.images.push({
        image: imageSrc,
        comment: ''
      });
    };

    $scope.submitRecord = function () {
      Records.submitRecord($scope.record)
        .success(function(data) {
          console.log(data);
        });
    };

    $scope.onSelect = function ($item) {
      $scope.record.game = $item.game;
      $scope.record.console = $item.console;
    };

  });
