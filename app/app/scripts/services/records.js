'use strict';

angular.module('highscoreApp')
  .service('Records', function Records($http) {

    this.getAllRecords = function() {
      return $http.get('json/allrecords.json');
    };

    this.getUnapprovedRecords = function() {
      return $http.get('http://127.0.0.1:8080/api/records/unapproved');
    };

    this.getRejectedRecords = function() {
      return $http.get('http://127.0.0.1:8080/api/records/rejected');
    };

    this.unapproveRecord = function ( record ) {
      return $http.put('http://127.0.0.1:8080/api/record/' + record._id + '/status/unapproved', record);
    };

    this.rejectRecord = function ( record ) {
      return $http.put('http://127.0.0.1:8080/api/record/' + record._id + '/status/rejected', record);
    };

    this.approveRecord = function ( record ) {
      return $http.put('http://127.0.0.1:8080/api/record/' + record._id + '/status/approved', record);
    };

    this.getLevel = function(console, game, level, allToggle) {
      var url = '';

      if(allToggle) {
        url = 'http://127.0.0.1:8080/api/records/' + console + '/' + game + '/' + level + '/all';
      } else {
        url = 'http://127.0.0.1:8080/api/records/' + console + '/' + game + '/' + level;
      }

      return $http.get(url);
    };

    this.submitRecord = function ( record ) {
      return $http.post('http://127.0.0.1:8080/api/record', record);
    };

    this.updateRecord = function ( record ) {
      return $http.put('http://127.0.0.1:8080/api/record/' + record._id, record);
    };

    this.getLevels = function ( config ) {
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
