'use strict';

angular.module('highscoreApp')
  .service('Records', function Records($http) {

    this.getAllRecords = function() {
      return $http.get('json/allrecords.json');
    };

    this.getRecords = function(id) {
      id = 10;
      return $http.get('json/records.json');
    };

    this.getConsoles = function(id) {
      id = 10;
      return $http.get('json/consoles.json');
    };
  });
