'use strict';

angular.module('highscoreApp')
  .service('Utilities', function Utilities() {
    this.getRecordImageSize = function(size) {
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

    this.getRecordTime = function(milliseconds) {
      var date = new Date(milliseconds);
      var timeUTC = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' +  date.getUTCSeconds();
      return timeUTC;
    };

    this.getUrlFriendly = function(name) {
      return name.replace(/ /g, '-');
    };

    this.getUrlUnfriendly = function(name) {
      return name.replace(/-/g, ' ');
    };

    this.calcHours = function (time) {
      time = time.split(':');

      var hours = (time[0] * 60 * 60)*1000;
      var minutes = (time[1] * 60) * 1000;
      var seconds = time[2] * 1000;
      var milliseconds = time[3];

      return hours + minutes + seconds + milliseconds;
    };
  });
