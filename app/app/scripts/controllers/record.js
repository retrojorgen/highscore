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
    $scope.temp = {};
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

        console.log($scope.games);
      });


    $scope.images = [];

    $scope.addImage = function ( imageSrc ) {
      $scope.record.images.push({
        image: imageSrc,
        comment: ''
      });
    };

    $scope.submitRecord = function () {
      console.log($scope.record);
      Records.submitRecord($scope.record)
        .success(function(data) {
          console.log(data);
        });
    };

    $scope.setGameAndConsole = function ($item) {
      console.log($item);
      $scope.record.game = $item.game;
      $scope.record.console = $item.console;
    };

    $scope.setGame = function ($item) {
      $scope.record.game = $item;
    };

    $scope.setConsole = function ($item) {
      $scope.record.console = $item;
    };

    $scope.calcHours = function (time) {
      var hours = (time[0] * 60 * 60)*1000;
      var minutes = (time[1] * 60) * 1000;
      var seconds = time[2] * 1000;
      var milliseconds = time[3];

      return hours + minutes + seconds + milliseconds;
    };

    $scope.imageCheck = function (images) {
      if(images) {
        if(images.length > 1) {
          return true;
        } else {
          return false;
        }
      }
    };

    $scope.checkTime = function(time) {
      if(time) {
        var _time = time.split(':');

        if(_time.length === 4) {
          $scope.record.milliseconds = $scope.calcHours(_time);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

  });
