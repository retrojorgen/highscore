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

    this.getGameRecords = function(id) {
      id = 10;
      return $http.get('json/recordsGame.json');
    };

    this.getConsoles = function(id) {
      id = 10;
      return $http.get('json/consoles.json');
    };

    this.getConsole = function(id) {
      id = 10;
      return $http.get('json/recordsConsole.json');
    };

    this.getLevel = function(id) {
      id = 10;
      return $http.get('json/recordsLevel.json');
    };

    this.submitRecord = function(record) {
      return $http.post('http://127.0.0.1:8080/api/record', record);
    };

    this.getLevels = function(config) {
      if(!config) {
        return $http.get('http://127.0.0.1:8080/api/levels');
      } else {
        if(config.console && !config.game) {
          return $http.get('http://127.0.0.1:8080/api/levels/' + config.console);
        }
        if(config.console && config.game) {
          return $http.get('http://127.0.0.1:8080/api/levels/' + config.console + '/' + config.game);
        }
      }
    };
  });
