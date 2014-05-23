'use strict';

angular.module('highscoreApp')
  .controller('MainCtrl', function ($scope, $routeParams, $location, Utilities, socketio) {

    var socket = socketio.connect('http://localhost:6060');
    console.log($location.url());

    $scope.params = $routeParams;

    if($routeParams.console && $routeParams.game && $routeParams.level) {
      $scope.convertedParams = {
        console: Utilities.getUrlUnfriendly($routeParams.console),
        game: Utilities.getUrlUnfriendly($routeParams.game),
        level: Utilities.getUrlUnfriendly($routeParams.level),
        type: $routeParams.type
      };
      socket.emit('get records', $scope.convertedParams);
    }

    $scope.records = [];

    socket.on('get records done', function(records) {
      $scope.$apply(function (){
        $scope.records = records;
      });
    });

    socket.on('connect', function() {
      console.log('hestepaere');
    });

    socket.on('record', function(record) {
      $scope.$apply(function() {
        $scope.records.push(record);
      });
    });
  });
