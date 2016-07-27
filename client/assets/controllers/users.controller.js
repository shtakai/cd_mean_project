
(function () {
  'use strict'

  angular
    .module('app')
    .controller('UsersController', Controller)

  function Controller (UserFactory, $location, $routeParams, $rootScope) {
    var _this = this
    _this.errors = []
    $rootScope.errors = null
    $rootScope.messages = null

    activate()

    function activate () {
      UserFactory.getSessionUser(function (data) {
        if (data != null) {
          _this.user = data
        } else {
          $rootScope.errors = {message: 'you are not logged in'}
          $location.url('/')
        }
      })
    }
    _this.login = function () {
      _this.errors = []
      UserFactory.login(_this.user, function (data) {
        if (data.status) {
          _this.user = data.user
          console.log('----->')
          $location.url('/dashboard')
        } else {
          _this.errors = data.errors
          $rootScope.errors = data.errors
        }
        _this.user = {}
      })
    }
    _this.logout = function () {
      UserFactory.logout(function (data) {
        _this.user = {}
        $location.url('/')
      })
    }
  }
})()
