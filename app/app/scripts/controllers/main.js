'use strict';

angular.module('highscoreApp')
  .controller('MainCtrl', function ($scope, Records) {
    $scope.newest = {};
    $scope.best = {};
    $scope.worst = {};

    Records.getAllRecords()
      .success(function(data) {
        $scope.newest = data.newest;
        $scope.best = data.best;
        $scope.worst = data.worst;
      });

    $scope.getRecordImageSize = function(size) {
      switch(size) {
        case 0:
          return '680';
        case 1:
          return '340';
        case 2:
          return '340';
        case 3:
          return '500';
        case 4:
          return '500';
        default:
          return '50';
      }
    };

    $scope.getRecordTime = function(milliseconds) {
      var date = new Date(milliseconds);
      var timeUTC = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' +  date.getUTCSeconds();
      return timeUTC;
    };

  });
