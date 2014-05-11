'use strict';

angular.module('highscoreApp')
  .controller('ApproveCtrl', function ($scope, Records, Utilities) {

    $scope.records = [];

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

    $scope.getUrlFriendly = Utilities.getUrlFriendly;

    $scope.getSafeString = function (unsafeString) {
      var safeString = unsafeString.replace(/ /g, '_');

      safeString = safeString.toLowerCase();

      return safeString;
    };

    $scope.getUnapprovedRecords = function() {
      Records.getUnapprovedRecords()
        .success(function ( data ) {
          $scope.records = data;
        });
    };

    $scope.getRejectedRecords = function() {
      Records.getRejectedRecords()
        .success(function ( data ) {
          $scope.records = data;
        });
    };

    $scope.getUnapprovedRecords();

    $scope.approve = function ( record ) {
      console.log('bla');
      Records.approveRecord(record)
        .success(function () {
          record.status = 'approved';
        });
    };

    $scope.reject = function ( record ) {
      console.log('bla');
      Records.rejectRecord(record)
        .success(function () {
          record.status = 'rejected';
        });
    };

    $scope.unApprove = function ( record ) {
      console.log('bla');
      Records.unapproveRecord(record)
        .success(function() {
          record.status = 'unapproved';
        });
    };

    $scope.update = function ( record ) {
      Records.updateRecord(record)
        .success(function () {
          console.log('success');
        });
    };

    $scope.updateMilliseconds = function (time, record) {
      record.milliseconds = Utilities.calcHours(time);
    };

  });
