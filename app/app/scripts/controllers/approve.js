'use strict';

var ModalInstanceCtrl = function ($scope, $modalInstance, record) {

  $scope.record = record;

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

angular.module('highscoreApp')
  .controller('ApproveCtrl', function ($scope, Records, $modal, $log) {
    $scope.unapprovedRecords = [];

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

    Records.getUnapprovedRecords()
      .success(function ( data ) {
        $scope.unapprovedRecords = data;
      });

    $scope.open = function (size, record) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: ModalInstanceCtrl,
        size: size,
        resolve: {
          record: function () {
            return record;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  });
