'use strict';

describe('Service: Helpers', function () {

  // load the service's module
  beforeEach(module('highscoreApp'));

  // instantiate service
  var Helpers;
  beforeEach(inject(function (_Helpers_) {
    Helpers = _Helpers_;
  }));

  it('should do something', function () {
    expect(!!Helpers).toBe(true);
  });

});
