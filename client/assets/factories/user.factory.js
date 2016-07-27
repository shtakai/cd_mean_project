(function () {
  'use strict'

  angular
    .module('app')
    .factory('UserFactory', factory)

  function factory ($http) {
    var factory = {}
    var user = null
    function getSession (callback) {
      $http.get('/session')
        .then(function (res) {
          if (res.data.status) {
            user = res.data.user
            callback(user)
          }else{
            user = null
            callback(user)

          }
        })
        .catch(function (err) {
        })
    }
    factory.getSessionUser = function (callback) {
      getSession(callback)
    }
    factory.logout = function (callback) {
      $http.get('/logout')
        .then(function (res) {
          user = null
          callback(res.data)
        })
        .catch(function (err) {
        })
    }
    factory.login = function (info, callback) {
      $http.post('/login', info)
        .then(function (res) {
          if (res.data.status) {
            user = res.data.session
          }
          callback(res.data)
        })
        .catch(function (err) {
        })
    }

    factory.getPolls = function(callback){
      $http.get('/polls')
        .then(function(res){
          callback(res.data)
        }).catch(function(err){
        })
    }

    factory.getPoll = function(id, callback){
      $http.get(`/polls/${id}`)
        .then(function(res){
          callback(res.data)
        }).catch(function(err){
        })
    }

    factory.vote = function(id, callback){
      $http.get(`/options/${id}/vote`)
        .then(function(res){
          callback(res.data)
        }).catch(function(err){
        })
    }

    factory.createPoll = function(poll, callback){
       $http.post('/polls', poll)
         .then(function(res){
           callback(res.data)
         }).catch(function(err){
           callback(res.data)
         })
    }

    factory.deletePoll = function(id, callback){
       $http.delete(`/polls/${id}`)
         .then(function(res){
           callback(res.data)
         }).catch(function(err){
           callback({status:false, errors:err})
         })
    }

    return factory
  }
})()
