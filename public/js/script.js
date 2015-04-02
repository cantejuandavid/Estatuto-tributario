var app = angular.module('StarterApp', ['ngMaterial']);

app.config(['$mdThemingProvider', '$mdIconProvider',
	function($mdThemingProvider,$mdIconProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('teal')
			.accentPalette('blue')

        $mdIconProvider
            .icon('facebook', 'images/svg/facebook.svg', 24)
            .icon('twitter', 'images/svg/twitter.svg', 24)
            .icon('about', 'images/svg/about.svg', 24)
	}
])

app.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function() {
        $mdSidenav('left').close()
            .then(function(){
                $log.debug("close LEFT is done");
            });
    };
})

app.controller('AppCtrl', function($scope, $mdSidenav,$timeout,$mdBottomSheet){
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };
    $scope.alert = '';
    $scope.showGridBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'templates/bottom/bottom-sheet-grid-template.html',
            controller: 'GridBottomSheetCtrl',
            targetEvent: $event
        }).then(function(clickedItem) {
            $scope.alert = clickedItem.name + ' cliqueado!';
            });
    };
});


(function () {
  'use strict';
  app.controller('DemoCtrl', DemoCtrl);
  function DemoCtrl ($timeout, $q, $log) {
    var self = this;
    // list of `state` value/display objects
    self.states        = loadAll();
    self.selectedItem  = null;
    self.searchText    = null;
    self.querySearch   = querySearch;
    self.simulateQuery = false;
    self.isDisabled    = false;
    self.selectedItemChange = selectedItemChange;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : [],
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + item);
    }
    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
  }
})();

app.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
    $scope.items = [        
        { name: 'Twitter', icon: 'twitter' },      
        { name: 'Facebook', icon: 'facebook' },
        { name: 'Acerca', icon: 'about' },
    ];
    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
})