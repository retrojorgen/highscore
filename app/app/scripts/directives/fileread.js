'use strict';

angular.module('highscoreApp')
  .directive('fileread', [function () {

    return {
      scope: {
        fileread: '='
      },

      link: function (scope, element, attributes) {
        console.log(attributes);
        element.bind('change', function (changeEvent) {
          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              console.log(loadEvent.target);
              scope.fileread = loadEvent.target.result;
              scope.$parent.addImage(loadEvent.target.result);
            });
          };
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    };
  }]);
