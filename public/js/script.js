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
      when('/buscar', {
        templateUrl: 'templates/search/search.jade',
        controller: 'searchInput'
      }).
      when('/buscar/:type/:number/', {
        templateUrl: 'templates/index/searchParticular.jade',
        controller: 'search'      
      }). 
      when('/buscar/:type/:number/:type2/todos', {
        templateUrl: 'templates/index/searchTypes.jade',
        controller: 'search'      
      }).   
      when('/buscar/:type/:number/:type2/:number2', {
        templateUrl: 'templates/index/searchTypeArts.jade',
        controller: 'search'      
      }). 
      when('/buscar/:type/:number/:type2/:number2/:type3/todos', {
        templateUrl: 'templates/index/searchTypes.jade',
        controller: 'search'      
      }). 
      when('/buscar/:type/:number/:type2/:number2/:type3/:number3', {
        templateUrl: 'templates/index/searchTypeArts.jade',
        controller: 'search'      
      }).
      when('/buscar/:type/:number/:todos?', {
        templateUrl: 'templates/index/searchTypeArts.jade',
        controller: 'search',
      }).  
      when('/addart', {
        templateUrl: 'templates/index/addart.jade',
        controller: 'addart'      
      }).      
      otherwise({
        redirectTo: '/'
      });
    }
])

estatutoApp.controller('indexController', function(){
})

estatutoApp.controller('AppCtrl', function($scope, $http,$mdSidenav,$timeout,$mdBottomSheet,$mdDialog,$log,$location,$anchorScroll){
  //toggleSidenav
  $scope.previusRoute = []
  $scope.buscador = {
    key : '',
    open: function() {
      var el = document.getElementById('buscador')
      var input = document.getElementById('inputBuscador')
      el.style.display = 'block'
      input.focus()

      document.onkeypress = function (e) {
        if (e.keyCode == 13) $scope.buscador.enviar()        
      }
      $scope.previusRoute.push($location.path())
      $location.path('buscar') 
    },
    close: function() {      

      var el = document.getElementById('buscador')
      el.style.display = 'none'      
      $location.path($scope.previusRoute[0])
      $scope.previusRoute = []
    },
    enviar: function() {  
      $http.post('/buscar', {key: $scope.buscador.key}).
        success(function(data, status, headers, config) {
          $scope.r = data          
        }).
        error(function(data, status, headers, config) {
        })
    }
  }
  $scope.$on( "$routeChangeStart", function(event, next, current) {
    $mdSidenav('left').close()     
    if(next.$$route.controller !== 'searchInput') {
      document.getElementById('buscador').style.display = 'none'      
    } 
  });
  $scope.cargando = true
  $scope.toggleSidenav = function(menuId) {

      $mdSidenav(menuId).toggle()
  }
  

  $scope.barTop = 'ET Nacional'
  

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

  $scope.menus = [{
    type: 'Nacional',
    children:[
      {name: 'inicio', url:'./#/'},
      {name: 'Explorador del estatuto', url:'./#/buscar/libro/todos'},
      {name: 'Reformas tributarias', url:'reformas-tributarias'},
      {name: 'Vencimientos', url:'./#/buscar/libro/todos'},
    ]
  }]

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
    if(c)
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

estatutoApp.controller('search', function($scope, $routeParams,$http,$sce,$location) {
  var type  = $routeParams.type || 'titulo'
  var number = $routeParams.number || 'todos'
  var url   = $location.url()
  $http.
    get(url).
    success(function(data){        
      $scope.hideCargando()
      $scope.res = data  

      if(!data.error) {      
        for(var i in data.data) {                
          $scope.res.data[i].description = $sce.trustAsHtml($scope.res.data[i].description) 
          if($scope.res.data[i].history) {
            for(var a in $scope.res.data[i].history) {     
              $scope.res.data[i].history[a].content = $sce.trustAsHtml($scope.res.data[i].history[a].content)
            }
          }          
        }                 
      }
    }).
    error(function() {      
      $scope.res = $sce.trustAsHtml('<h1>No se ha podido conectar con el servidor</h1>')
    })    
})

estatutoApp.controller('searchInput', function($scope) {
  $scope.buscador.open()  
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

estatutoApp.controller('addart', function($scope, $routeParams,$http,$sce, $location) {
  $scope.art;
  $scope.ids = {}

  $http.
    get('get-ids').
    success(function(data){$scope.ids = data})

  $scope.agregarArt = function() {

      
    $scope.art.history = JSON.parse($scope.art.history)       
    $http.
      post('addart', {art:$scope.art}).
      success(function(data){

      })
  }
})


