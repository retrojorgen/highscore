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
    $scope.editRecord = {};


    $scope.setEditRecord = function (record) {
      $scope.editRecord = angular.copy(record);
      console.log($scope.editRecord);
    };

    $scope.closeEditRecord = function () {
      $scope.editRecord = {};
    };

    $scope.updateRecord = function() {
      socket.emit('update record', $scope.editRecord);
    };

    $scope.deleteRecord = function (record) {
      console.log(record);
      socket.emit('delete record', record);
    };

    socket.on('update record done', function(record) {
      console.log('update record done:', record);
      var recordIndex = _.findIndex($scope.records, function(_record) {
        return _record._id === record._id;
      });
      $scope.$apply(function() {
        $scope.records[recordIndex] = record;
        $scope.editRecord = {};
      });
    });

    socket.on('delete record done', function(record) {
      var recordIndex = _.findIndex($scope.records, function(_record) {
        return _record._id === record._id;
      });
      console.log(recordIndex);
      if(recordIndex >= 0) {
        $scope.$apply(function() {
          $scope.records.splice(recordIndex, 1);
        });
      }
    });

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
