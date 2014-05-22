'use strict';

describe('Controller: ApproveCtrl', function () {

  // load the controller's module
  beforeEach(module('highscoreApp'));

  var ApproveCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApproveCtrl = $controller('ApproveCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
