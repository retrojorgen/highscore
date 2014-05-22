'use strict';

angular.module('highscoreApp')
  .factory('socketio', function () {
    return io;
  });
