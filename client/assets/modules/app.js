console.log('app module')

angular.module('app' ,['ngRoute', 'ngMessages'])

angular.module('app')
  .config(($routeProvider) => {
    console.log('route config')
    $routeProvider
      .when('/', {
        templateUrl: '../../partials/login.html',
      })
      .when('/polls/:id', {
        templateUrl: '../../partials/poll.html'
      })
      .when('/polls', {
        templateUrl: '../../partials/polls.html'
      })
     .when('/newPoll', {
       templateUrl: '../../partials/new_poll.html'
     })
      .otherwise({
        redirectTo: '/'
      })

  }
  )
