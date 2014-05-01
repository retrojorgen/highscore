'use strict';

angular.module('highscoreApp')
  .controller('RecordCtrl', function ($scope, Records) {
    $scope.uploadme = {};
    $scope.uploadme.src = '';

    $scope.images = [];

    $scope.addImage = function ( imageSrc ) {
      $scope.images.push(imageSrc);
    };

    $scope.submitRecord = function () {
      Records.uploadRecord($scope.images)
        .success(function(data) {
          console.log(data);
        });
    };
  });
