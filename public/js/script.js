
angular.module('StarterApp', ['ngMaterial', 'ngRoute', 'ngSanitize'])

.config(['$mdThemingProvider', '$mdIconProvider','$routeProvider',
	function($mdThemingProvider,$mdIconProvider,$routeProvider) {

		$mdThemingProvider
			.theme('default')

    $mdIconProvider
      .icon('facebook', 'images/svg/facebook.svg', 24)
      .icon('twitter', 'images/svg/twitter.svg', 24)
      .icon('about', 'images/svg/about.svg', 24)
      .icon('help', 'images/svg/help.svg')

    $routeProvider
      .when('/', {
        templateUrl: 'templates/index/index.pug'
      })
      .when('/buscar', {
        templateUrl: 'templates/search/search.pug',
        controller: 'searchInput'
      })
      .when('/buscar/:type/:number/', {
        templateUrl: 'templates/index/articleSearch.pug',
        controller: 'search'
      })
      .when('/buscar/:type/:number/:type2/todos', {
        templateUrl: 'templates/index/searchTypes.pug',
        controller: 'search'
      })
      .when('/buscar/:type/:number/:type2/:number2', {
        templateUrl: 'templates/index/searchTypeArts.pug',
        controller: 'search'
      })
      .when('/buscar/:type/:number/:type2/:number2/:type3/todos', {
        templateUrl: 'templates/index/searchTypes.pug',
        controller: 'search'
      })
      .when('/buscar/:type/:number/:type2/:number2/:type3/:number3', {
        templateUrl: 'templates/index/searchTypeArts.pug',
        controller: 'search'
      })
      .when('/buscar/:type/:number/:todos?', {
        templateUrl: 'templates/index/searchTypeArts.pug',
        controller: 'search',
      })
      .when('/addart', {
        templateUrl: 'templates/index/addArticle.pug',
        controller: 'addart'
      })
			.when('/about', {
        templateUrl: 'templates/index/about.pug'
      })
			.when('/api', {
        templateUrl: 'templates/index/api.pug'
      })
      .otherwise({
        redirectTo: '/'
      });
    }
])

.controller('AppCtrl', function($scope, $http,$mdSidenav,$timeout,$sce,$mdToast,$mdBottomSheet,$mdDialog,$log,$location,$anchorScroll){
  $scope.barTop = 'Explorador'
  $scope.previusRoute = []
  $scope.cargando = true
	console.log('Este es un mensaje');
setTimeout(function () {
  console.log('Este es otro mensaje');
}, 0);
console.log('Este es el último mensaje');
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
      if($scope.previusRoute[0] == '/buscar') { window.history.back()}
      $location.path($scope.previusRoute[0])
      $scope.previusRoute = []
    },
    enviar: function() {
      document.getElementById('inputBuscador').blur()
      document.getElementById('busqueda').focus()
      $scope.$apply(function(){
        $scope.cargando = true
      })
      $http.post('/buscar', {key: $scope.buscador.key}).
        success(function(data, status, headers, config) {
          $scope.r = data
					console.log(data)
          for(var i in data.data) {
            if($scope.r.data[i].description) {
              var t = $scope.r.data[i].description.substring(0,200)
              t = t.substr(0, Math.min(t.length, t.lastIndexOf(" "))) + ' ...'
              $scope.r.data[i].description = $sce.trustAsHtml(t)
            }
          }
          $scope.cargando = false
        }).
        error(function(data, status, headers, config) {
        })
    }
  }
  $scope.openHistory = {
    val : false,
    label: 'ocultar'
  }
  $scope.menus = [{
    type: 'Nacional',
    children:[
      {name: 'Inicio', url:'./#/', icon: 'home'},
      {name: 'Explorador del estatuto', url:'./#/buscar/libro/todos', icon: 'explore'},
      {name: 'Configuración', url:'./#/set', icon: 'build'},
			{name: 'Sobre nosotros', url:'./#/about', icon: 'help'},
			{name: 'API', url:'./#/api', icon: 'adb'}
    ]
  }]
  $scope.$on( "$routeChangeStart", function(event, next, current) {
    $scope.res = null
    $mdSidenav('left').close()
    $scope.cargando = true
		if(next.$$route) {
			if(next.$$route.controller !== 'searchInput') {
				document.getElementById('buscador').style.display = 'none'
			}
		}

  });
  $scope.toggleSidenav = function(menuId) {

      $mdSidenav(menuId).toggle()
  }
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
		if(num)
    	var n = num.toString().replace('.','-')
    	return n
  }
  $scope.toggleopenHistory = function() {
    $scope.openHistory.val = $scope.openHistory.val === false ? true: false;
    $scope.openHistory.label = $scope.openHistory.val === false ? 'ocultar': 'ver';
  }
  $scope.hideCargando = function() {

    $scope.cargando = false
  }
  $scope.showCargando = function() {
    var c = document.getElementById('cargando')
    if(c)
      c.style.display = 'block'
  }
	$scope.showIssue = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
		let art = document.getElementById("reportar").getAttribute("data-art")
		console.log(art)
    var confirm = $mdDialog.prompt()
      .title('¿Quiere reportar este artículo?')
      .textContent('Artículo '+ art)
      .placeholder('Motivos')
      .ariaLabel('')
      .initialValue('')
      .targetEvent(ev)
      .ok('Reportar')
      .cancel('No, gracias');

    $mdDialog.show(confirm).then(function(result) {
			$http.
		    post('issue',
				{articulo: art, content: result})
				.then(function(res){
					console.log(res)
					$mdToast.show(
						$mdToast.simple()
						.textContent('Agradecemos su reporte ;) ')
						.position('top right')
						.hideDelay(1500)
					);
		    }, function(err) {
					console.log(err)
		    })

    }, function() {
      console.log('no gracias')
    });
  };
	$scope.showShare = function(ev) {
	 // Appending dialog to document.body to cover sidenav in docs app
	 // Modal dialogs should fully cover application
	 // to prevent interaction outside of dialog
	 $mdDialog.show(
		 $mdDialog.alert()
			 .parent(angular.element(document.querySelector('#popupContainer')))
			 .clickOutsideToClose(true)
			 .title('No se ha implementado!')
			 .textContent('Estamos trabajando para mejorar :)')
			 .ariaLabel('Share Info')
			 .ok('Entiendo!')
			 .targetEvent(ev)
	 );
 	};

	$scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'templates/index/dev.pug',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
  };

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

})

.controller('search', function($scope, $routeParams,$http,$sce,$location,$mdDialog) {
  var type  = $routeParams.type || 'titulo'
  var number = $routeParams.number || 'todos'
	hideButtons("Prev")
	hideButtons("Next")
  $http.
    get($location.url())
		.then(function(res){
      $scope.hideCargando()
      $scope.data = res.data
      if(!res.error) {
				if(res.data.links)
					setPrevandNext(res.data.links)
        for(var i in res.data.data) {
          $scope.data.data[i].description = $sce.trustAsHtml($scope.data.data[i].description)
          if($scope.data.data[i].history) {
            for(var a in $scope.data.data[i].history) {
              $scope.data.data[i].history[a].content = $sce.trustAsHtml($scope.data.data[i].history[a].content)
            }
          }
        }
      }
    }, function(res) {
			console.log(res)
      $scope.res = $sce.trustAsHtml('<h1>No se ha podido conectar con el servidor</h1>')
    })
})

.controller('searchInput', function($scope) {
  $scope.buscador.open()
  $scope.hideCargando()
	hideButtons("Prev")
	hideButtons("Next")
})

.controller('addart', function($scope, $routeParams,$http,$sce, $location) {
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

function hideButtons(i){
	document.getElementById("n"+i).style.display = 'none'
}

function setPrevandNext (links) {
	if(links.next) {
		document.getElementById("nNext").setAttribute("href", "#/buscar/articulo/"+links.next)
		document.getElementById("nNext").style.display = 'block'
	}
	if(links.prev) {
		document.getElementById("nPrev").setAttribute("href", "#/buscar/articulo/"+links.prev)
		document.getElementById("nPrev").style.display = 'block'
	}
}
