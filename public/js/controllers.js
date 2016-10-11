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
                  $http.get("index_estatuto.json").then(function(arreglo) {                    
                    localStorage.setItem("arts", JSON.stringify(arreglo.data))       
                    navTeclaAndSwipe(number, localStorage.getItem("arts"));
                  })                 
                }
                else{ navTeclaAndSwipe(number, localStorage.getItem("arts"))}
              }
              else
              {             
                $http.get("index_estatuto.json").then(function(arreglo) {                   
                  navTeclaAndSwipe(number, JSON.stringify(arreglo.data));                
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
        var index = arts.indexOf(number)
        var next = arts[index+1]
        var previus = arts[index-1]    
        console.log(previus+"-"+next) 
        document.onkeydown = function (e) {                  
          if (e.keyCode == 39)
            cambiarPage(next)
          if (e.keyCode == 37)
            cambiarPage(previus)
        }

        if(detectarMobile()) {
          var hammertime = new Hammer(document.getElementById("targetSwipe"))
            hammertime.on("swipe", function(ev) {
              ev.preventDefault()
              if(ev.direction == 2) cambiarPage(next)
              else if(ev.direction == 4) cambiarPage(previus)
            })  
        }  
      }

      function cambiarPage(art) {        
        $rootScope.$apply(function() {
          if(art)
            $location.path("/buscar/articulo/"+art);                      
        });
      }  
      function detectarMobile() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      }
    }

    ])
      
    .controller('searchIndexController', ['$scope', function($scope) {
      $scope.buscador.open()
      
      hideButtons("Prev")
      hideButtons("Next")
    }])

    .controller('addArtController', ['$scope','$http', function($scope,$http) {
      $scope.art= {};
      $scope.art.history = []

      $scope.art.history[0] = {
        "type": "",
        "year": "",
        "content": ""
      }
      
      $scope.ids = {}

      $http.get('get-ids').success(function(data){$scope.ids = data})

      $scope.agregarArt = function(ev) {        
        $http.post('addart', {art:$scope.art}).success(function(data){
        })
      }

      $scope.addHistory = function() {
        $scope.art.history.push({
          type: "",
          year: "",
          content: ""
        })
      }
      $scope.removeHistory = function(index) {
        $scope.art.history.splice(index, 1)
      }
      $scope.showHistory = function() {
        console.log($scope.art)
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