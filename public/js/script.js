(function(){

  var app = angular.module('estatutoAPP', [
    'ngMaterial',
    'ngRoute',
    'ngSanitize',
    'estatutoAPP.controllers'
  ]);

  app.config(['$mdThemingProvider','$routeProvider', function($mdThemingProvider,$routeProvider) {

		$mdThemingProvider
			.theme('default')

    $routeProvider
      .when('/', {
        templateUrl: 'templates/index/index.pug'
      })
      .when('/buscar', {
        templateUrl: 'templates/search/search.pug',
        controller: 'searchIndexController'
      })
      .when('/buscar/:type/:number/', {
        templateUrl: 'templates/index/articleSearch.pug',
        controller: 'searchController'
      })
      .when('/buscar/:type/:number/:type2/todos', {
        templateUrl: 'templates/index/searchTypes.pug',
        controller: 'searchController'
      })
      .when('/buscar/:type/:number/:type2/:number2', {
        templateUrl: 'templates/index/searchTypeArts.pug',
        controller: 'searchController'
      })
      .when('/buscar/:type/:number/:type2/:number2/:type3/todos', {
        templateUrl: 'templates/index/searchTypes.pug',
        controller: 'searchController'
      })
      .when('/buscar/:type/:number/:type2/:number2/:type3/:number3', {
        templateUrl: 'templates/index/searchTypeArts.pug',
        controller: 'searchController'
      })
      .when('/buscar/:type/:number/:todos?', {
        templateUrl: 'templates/index/searchTypeArts.pug',
        controller: 'searchController',
      })
      .when('/addart', {
        templateUrl: 'templates/index/addArticle.pug',
        controller: 'addArtController'
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
  }])

})();