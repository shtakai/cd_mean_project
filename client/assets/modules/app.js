console.log('app module')

angular.module('app' ,['ngRoute', 'ngMessages'])

angular.module('app')
  .config(($routeProvider) => {
    console.log('route config')
    $routeProvider
      .when('/', {
        templateUrl: '../../partials/login.html',
      })
      .when('/dashboard', {
        templateUrl: '../../partials/dashboard.html'
      })
      .otherwise({
        redirectTo: '/'
      })

  }
  )
