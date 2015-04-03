var estatutoApp = angular.module('StarterApp', ['ngMaterial', 'ngRoute']);

estatutoApp.config(['$mdThemingProvider', '$mdIconProvider','$routeProvider',
	function($mdThemingProvider,$mdIconProvider,$routeProvider) {

		$mdThemingProvider.
      theme('default')
    		.primaryPalette('red')
    		.accentPalette('blue')

    $mdIconProvider
      .icon('facebook', 'images/svg/facebook.svg', 24)
      .icon('twitter', 'images/svg/twitter.svg', 24)
      .icon('about', 'images/svg/about.svg', 24)
      .icon('help', 'images/svg/help.svg')

    $routeProvider
      .when('/', {
        templateUrl: 'templates/index/index.html',
        controller: 'indexController'
      }).
      otherwise({
        redirectTo: '/'
      });
    }
])
estatutoApp.controller('indexController', function(){

})

estatutoApp.controller('AppCtrl', function($scope, $mdSidenav,$timeout,$mdBottomSheet,$mdDialog){
    //toggleSidenav
    $scope.toggleSidenav = function(menuId) {

        $mdSidenav(menuId).toggle();
    };

    //showAyuda
    $scope.alert = '';
    $scope.showGridBottomSheet = function($event) {
        $scope.alert = '';
        $mdBottomSheet.show({
            templateUrl: 'templates/bottom/bottom-sheet-grid-template.html',
            controller: 'GridBottomSheetCtrl',
            targetEvent: $event
        }).then(function(clickedItem) {
                if(clickedItem.url)
                    window.open(clickedItem.url, '_blank');
                else
                    $scope.alert = clickedItem.name + ' cliqueado!';
            });
    };

    //alert dialog large
    $scope.alert = '';  
    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'templates/search/search.html',
            targetEvent: ev,
            })
            .then(function(answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
            }, function() {
            $scope.alert = 'You cancelled the dialog.';
        });
    };

    $scope.menus = [
      {name: 'inicio', url:'index'},
      {name: 'Explorador del estatuto', url:'explorador-del-estatuto'},
      {name: 'Reformas tributarias', url:'reformas-tributarias'},
      {name: 'Vencimientos', url:'vencimientos-impuestos'},
    ]
    
});


estatutoApp.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
    $scope.items = [     
        { name: 'Ayuda', icon: 'help' },        
        { name: 'Twitter', icon: 'twitter', url: 'https://www.google.com' },      
        { name: 'Facebook', icon: 'facebook', url: 'https://www.google.com' },
        { name: 'Acerca', icon: 'about' },
    ];
    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
})

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}