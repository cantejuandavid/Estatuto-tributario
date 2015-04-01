var app = angular.module('StarterApp', ['ngMaterial']);

app.config(['$mdThemingProvider', 
	function($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('red')
			.accentPalette('blue')
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

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
 
}]);