'use strict';

describe('Controller: ConsolesCtrl', function () {

  // load the controller's module
  beforeEach(module('highscoreApp'));

  var ConsolesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConsolesCtrl = $controller('ConsolesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
