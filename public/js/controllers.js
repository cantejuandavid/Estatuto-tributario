(function() {

  angular.module('estatutoAPP.controllers', [])

    .controller('estatutoController', [
      '$scope',
      '$http',
      '$mdSidenav',
      '$sce',
      '$mdToast',
      '$mdBottomSheet',
      '$mdDialog',
      '$location',
      function($scope, $http,$mdSidenav,$sce,$mdToast,$mdBottomSheet,$mdDialog,$location){

        $scope.barTop = 'Explorador'
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
            if($scope.previusRoute[0] == '/buscar') { window.history.back()}
            $location.path($scope.previusRoute[0])
            $scope.previusRoute = []
          },
          enviar: function() {
            $scope.cargando = true
            document.getElementById('inputBuscador').blur()
            document.getElementById('busqueda').focus()
            
            var key = {key:$scope.buscador.key}
            
            $http.get($location.url(), {params: key}).then(function(data) {
              
              $scope.cargando = false
              $scope.r = data.data
              
                for(var i in $scope.r.data) {
                  if($scope.r.data[i].description) {
                    var t = $scope.r.data[i].description.substring(0,200)
                    t = t.substr(0, Math.min(t.length, t.lastIndexOf(" "))) + ' ...'
                    $scope.r.data[i].description = $sce.trustAsHtml(t)
                  }
                }
            }, function(res) {
              console.log(res)
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
            {name: 'Explorador', url:'./#/buscar/libro/todos', icon: 'explore'},
            {name: 'Configuración', url:'./#/set', icon: 'build'},
            {name: 'Sobre nosotros', url:'./#/about', icon: 'help'},
            {name: 'API', url:'./#/api', icon: 'adb'}
          ]
        }]

        $scope.$on( "$routeChangeStart", function(event, next, current) {                    
          $mdSidenav('left').close()

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
        $scope.showCargando = function() {
          var c = document.getElementById('cargando')
          if(c)
            c.style.display = 'block'
        }
        $scope.reportar = function(ev) {
          // Appending dialog to document.body to cover sidenav in docs app
          let art = document.getElementById("reportar").getAttribute("data-art")
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
                $mdToast.show(
                  $mdToast.simple()
                  .textContent('Agradecemos su reporte ;) ')
                  .position('top right')
                  .hideDelay(1500)
                );
              }, function(err) {
                console.log(err)
              })

          });
        };
        $scope.compartir = function(ev) {
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
        $scope.mostrarDev = function(ev) {

          $mdDialog.show({
            controller: DialogController,
            templateUrl: 'templates/index/dev.pug',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
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
        };
    }])

    .controller('searchController', [
      '$scope',
      '$routeParams',
      '$http',
      '$sce',
      '$location',
      '$rootScope',                            
      '$mdDialog',      
      function($scope, $routeParams,$http,$sce,$location,$rootScope,$mdDialog) {        
        var type  = $routeParams.type || 'titulo'
        var number = $routeParams.number || 'todos'
        $scope.cargando = true        
        hideButtons("Prev")
        hideButtons("Next")
              
        $http.get($location.url()).then(function(res){          
          $scope.data = res.data
          $scope.cargando = false
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
            
            if(res.data.links) {               

              if(localStorage) {
                if(!localStorage.getItem("arts")) {                                    
                  alert("1")
                  $http.get("index_estatuto.json").then(function(arreglo) {                    
                    localStorage.setItem("arts", JSON.stringify(arreglo.data))       
                    navTeclaAndSwipe(number, localStorage.getItem("arts"));
                  })                 
                }
                else{ navTeclaAndSwipe(number, localStorage.getItem("arts"));alert("2")}
              }
              else
              {    
                alert("3")            
                $http.get("index_estatuto.json").then(function(arreglo) {                   
                  navTeclaAndSwipe(number, arreglo.data);                
                })                                 
              }
            }
          }
        }, function(res) {   
          $scope.cargando = false       
          $scope.res = $sce.trustAsHtml('<h1>No se ha podido conectar con el servidor</h1>')
        })

      function navTeclaAndSwipe(number, data) {                
        var arts = JSON.parse(data)          
        var index = arts.indexOf(parseInt(number))
        var next = arts[index+1]
        var previus = arts[index-1]        
        
        document.onkeydown = function (e) {                  
          if (e.keyCode == 39)
            cambiarPage(next)
          if (e.keyCode == 37)
            cambiarPage(previus)
        }

        var hammertime = new Hammer(document.getElementById("targetSwipe"))
        hammertime.on("swipe", function(ev) {
          ev.preventDefault()
          if(ev.direction == 2) cambiarPage(next)
          else if(ev.direction == 4) cambiarPage(previus)
        })       
      }

      function cambiarPage(art) {        
        $rootScope.$apply(function() {
          if(art)
            $location.path("/buscar/articulo/"+art);                      
        });
      }  

      $scope.loadItems = function() {
        var last = $scope.data.data[$scope.data.data.length -1]
        for(var i = 1; i <= $scope.data.data.length; i++) {
          $scope.data.data
        }
      }

    }

    ])
      
    .controller('searchIndexController', ['$scope', function($scope) {
      $scope.buscador.open()
      
      hideButtons("Prev")
      hideButtons("Next")
    }])

    .controller('addArtController', ['$scope','$http', function($scope,$http) {
      $scope.art;
      $scope.ids = {}

      $http.get('get-ids').success(function(data){$scope.ids = data})

      $scope.agregarArt = function() {
        $scope.art.history = JSON.parse($scope.art.history)
        $http.post('addart', {art:$scope.art}).success(function(data){
        })
      }
    }])

  
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

})();