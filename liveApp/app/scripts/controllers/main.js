'use strict';

angular.module('highscoreApp')
  .controller('MainCtrl', function ($scope, socketio) {

    var socket = socketio.connect('http://localhost:6060');

    $scope.records = [];

    socket.on('connect', function() {
      console.log('hestepaere');
    });

    socket.on('record', function(record) {
      $scope.$apply(function() {
        $scope.records.push(record);
      });
    });
  });
