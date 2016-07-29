
(function () {
  'use strict'

  angular
    .module('app')
    .factory('OrderFactory', factory)

  function factory ($http) {
    console.log('OrderFactory')
    var factory = {}

    factory.getOrders = function(callback){
      console.log('F#getOrders')
      $http.get('/orders')
        .then((res) => {
          console.log(res)
          callback(res.data)

        })
        .catch( (err) => {

        })

    }

    factory.order = function(orderInfo, callback) {
      console.log('F#order', orderInfo)
      $http.post('/orders', orderInfo)
        .then( (res) => {
          console.log(res)
          callback(res.data)
        } )
        .catch((err) => {

        })
    }

    return factory
  }
})()
