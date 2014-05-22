'use strict';

angular.module('highscoreApp')
  .controller('newRecordCtrl', function ($scope, $routeParams, Records, Utilities, socketio) {

    var socket = socketio.connect('http://localhost:6060');

    $scope.record = {
      lap: 'track'
    };

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

    $scope.submitRecord = function () {
      $scope.record.console = $scope.convertedParams.console;
      $scope.record.game = $scope.convertedParams.game;
      $scope.record.level = $scope.convertedParams.level;
      $scope.record.milliseconds = Utilities.calcHours($scope.record.time);
      $scope.record.images = [];

      socket.emit('new record', $scope.record);
    };

    socket.on('new record done', function(){
      $scope.record = {
        lap: 'track'
      }
    });
  });
