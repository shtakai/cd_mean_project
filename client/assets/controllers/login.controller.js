
(function () {
  'use strict'

  angular
    .module('app')
    .controller('QAController', Controller)

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
          $location.path('/polls')
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

    _this.getPolls = function () {
      UserFactory.getPolls(function (data) {
        _this.polls = data.polls
      })
    }

    _this.getPoll = function(id) {
       UserFactory.getPoll($routeParams.id, function(data){
         _this.poll = data.poll
       })
    }

    _this.vote = function(option) {
       UserFactory.vote(option._id, function(data){
         if(data.status){
          option.vote += 1
         }else {
          _this.errors = data.errors
          $rootScope.errors = data.errors
         }
       })
    }

    _this.newPoll = function() {
       $location.url('/newPoll')
    }


    _this.index = function() {
       _this.poll = {}
       _this.option1 = ''
       _this.option2 = ''
       _this.option3 = ''
       _this.option4 = ''

       $location.url('/polls')
    }

    _this.createPoll = function() {
       UserFactory.createPoll(_this.poll, function(data){
          if(data.status){
             $location.url('/polls')
          }else{
            _this.errors = data.errors
            $rootScope.errors = data.errors
          }
       })
    }

    _this.deletePoll = function(id) {
       UserFactory.deletePoll(id, function(data){
          if(data.status){
            _this.polls = _this.getPolls()
            _this.index()
             $location.url('/polls')
          }else{
            _this.errors = data.errors
            $rootScope.errors = data.errors
          }
       })
    }
  }

})()
