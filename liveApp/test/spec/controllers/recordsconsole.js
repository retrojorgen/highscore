'use strict';

describe('Controller: RecordsconsoleCtrl', function () {

  // load the controller's module
  beforeEach(module('highscoreApp'));

  var RecordsconsoleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordsconsoleCtrl = $controller('RecordsconsoleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
