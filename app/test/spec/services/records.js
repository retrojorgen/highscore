'use strict';

describe('Service: Records', function () {

  // load the service's module
  beforeEach(module('highscoreApp'));

  // instantiate service
  var Records;
  beforeEach(inject(function (_Records_) {
    Records = _Records_;
  }));

  it('should do something', function () {
    expect(!!Records).toBe(true);
  });

});
