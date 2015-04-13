var estatutoApp = angular.module('StarterApp', ['ngMaterial', 'ngRoute']);

estatutoApp.config(['$mdThemingProvider', '$mdIconProvider','$routeProvider',
	function($mdThemingProvider,$mdIconProvider,$routeProvider) {

		$mdThemingProvider.
      theme('default')
    		.primaryPalette('red')
    		.accentPalette('indigo')

    $mdIconProvider
      .icon('facebook', 'images/svg/facebook.svg', 24)
      .icon('twitter', 'images/svg/twitter.svg', 24)
      .icon('about', 'images/svg/about.svg', 24)
      .icon('help', 'images/svg/help.svg')

    $routeProvider
      .when('/', {
        templateUrl: 'templates/index/index.jade',
        controller: 'indexController'
      }).
      when('/buscar/:type/:number/', {
        templateUrl: 'templates/index/searchParticular.jade',
        controller: 'searchParticular'      
      }). 
      when('/buscar/:type/:number/:type2/todos', {
        templateUrl: 'templates/index/searchTypes.jade',
        controller: 'searchParticular'      
      }).   
      when('/buscar/:type/:number/:type2/:number2', {
        templateUrl: 'templates/index/searchTypeArts.jade',
        controller: 'searchParticular'      
      }).   
      when('/buscar/:type/:number/:todos?', {
        templateUrl: 'templates/index/searchTypeArts.jade',
        controller: 'searchTypeArts',
      }).       
      otherwise({
        redirectTo: '/'
      });
    }
])

estatutoApp.run( function($rootScope, $location, $mdSidenav) {

  $rootScope.$on( "$routeChangeStart", function(event, next, current) {     
    $mdSidenav('left').close()    
  });
})

estatutoApp.controller('indexController', function(){
})

estatutoApp.controller('AppCtrl', function($scope, $mdSidenav,$timeout,$mdBottomSheet,$mdDialog,$log,$location,$anchorScroll){
  //toggleSidenav
  $scope.cargando = true;


  $scope.toggleSidenav = function(menuId) {

      $mdSidenav(menuId).toggle();
  };
  
  $scope.barTop = 'Inicio'
  
  //showAyuda
  $scope.alert = '';
  $scope.showGridBottomSheet = function($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
          templateUrl: 'templates/bottom/bottomSheetList.jade',
          controller: 'ListBottomSheetCtrl',
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

  $scope.romanize = function(num) {    
    if (!+num)
      return;
    var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
             "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
             "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "",
      i = 3;
    while (i--)
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }

  $scope.numberEstatuto = function(num) {
    var n = num.toString()
    return n.replace('.','-')
  }
  $scope.showAdvanced = function(ev) {
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'templates/search/search.jade',
          targetEvent: ev,
          })
          .then(function(answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
          }, function() {
          $scope.alert = 'You cancelled the dialog.';
      });
  };

  $scope.menus = [
    {name: 'inicio', url:'./#/'},
    {name: 'Explorador del estatuto', url:'explorador-del-estatuto'},
    {name: 'Reformas tributarias', url:'reformas-tributarias'},
    {name: 'Vencimientos', url:'./#/buscar/articulo/todos'},
  ]

  $scope.openHistory = {
    val : false,
    label: 'ocultar'
  }
  $scope.toggleopenHistory = function() {    
    $scope.openHistory.val = $scope.openHistory.val === false ? true: false;
    $scope.openHistory.label = $scope.openHistory.val === false ? 'ocultar': 'ver';
  };

  $scope.hideCargando = function() {
    var c = document.getElementById('cargando')
    c.style.display = 'none'    
  }
});

estatutoApp.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
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

estatutoApp.controller('searchParticular', function($scope, $routeParams,$http,$sce,$location) {

  var type  = $routeParams.type || 'titulo'
  var number = $routeParams.number || 'todos'
  var url   = $location.url()
  $http.
    get(url).
    success(function(data){  
      console.log(data)      
      $scope.hideCargando()
      $scope.res = data  

      if($scope.res.type)   
        // $scope.$parent.barTop = $scope.res.type +' ' + $scope.res.type.number

      if(!data.error) {
        
        //parseando html
        for(var i in $scope.res.data) {          
          $scope.res.data[i].description = $sce.trustAsHtml($scope.res.data[i].description)
        }                 
      }
    }).
    error(function() {      
      $scope.res = $sce.trustAsHtml('<h1>No se ha podido conectar con el servidor</h1>')
    })    
})

estatutoApp.controller('searchTypeArts', function($scope, $routeParams,$http,$sce, $location) {
  var type  = $routeParams.type  
  var number = $routeParams.number
  var url   = $location.url()
  console.log(url)
  $http.
    get(url).
    success(function(data){   
      console.log(data)
      $scope.hideCargando()        
      $scope.res = data
      if($scope.res.type)   
        // $scope.$parent.barTop = $scope.res.type +' ' + $scope.res.type.number

      if(!data.error) {        
        //parseando html        
        for(var i in $scope.res.data) {
          $scope.res.data[i].description = $sce.trustAsHtml($scope.res.data[i].description)
        } 
      }
      
    }).
    error(function() {      
      $scope.res = $sce.trustAsHtml('<h1>No se ha podido conectar con el servidor</h1>')
    })  
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

