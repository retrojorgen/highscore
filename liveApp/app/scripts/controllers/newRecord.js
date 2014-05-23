'use strict';

angular.module('highscoreApp')
  .controller('newRecordCtrl', function ($scope, $routeParams, Records, Utilities, socketio) {


    $('canvas').hide();
    var socket = socketio.connect('http://localhost:6060');

    $scope.record = {
      lap: 'track'
    };

    $scope.level = {};

    $scope.levels = {};

    $scope.getUrlFriendly = Utilities.getUrlFriendly;

    if($routeParams.console && $routeParams.game && $routeParams.level) {
      $scope.convertedParams = {
        console: Utilities.getUrlUnfriendly($routeParams.console),
        game: Utilities.getUrlUnfriendly($routeParams.game),
        level: Utilities.getUrlUnfriendly($routeParams.level)
      };
    }

    socket.emit('get levels');

    socket.on('levels done', function(levels) {
      $scope.$apply(function() {
        $scope.levels = levels;
      });
    });

    socket.on('add level done', function(level) {
      $scope.$apply(function() {
        $scope.levels.push(level);
      });
    });

    $scope.submitLevel = function() {
      console.log('submit level', $scope.level);
      socket.emit('add level', $scope.level);
    };

    $scope.submitRecord = function () {
      $scope.record.console = $scope.convertedParams.console;
      $scope.record.game = $scope.convertedParams.game;
      $scope.record.level = $scope.convertedParams.level;

      $scope.record.images = [];

      if(!$scope.record.email) {
        $scope.record.email = '';
      }

      if($scope.record.type === 'shortestTime' || $scope.record.type === 'longestTime') {
        $scope.record.milliseconds = Utilities.calcHours($scope.record.time);
      }

      socket.emit('new record', $scope.record);
    };

    socket.on('new record done', function(){
      $scope.$apply(function() {
        $scope.record = {
          lap: 'track'
        };
      });
    });
  });
