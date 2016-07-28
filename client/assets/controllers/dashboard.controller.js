
(function () {
  'use strict'

  angular
    .module('app')
    .controller('DashboardController', Controller)

  function Controller (OrderFactory, UserFactory, $location, $routeParams) {
    var _this = this
    var sellChart
    var buyChart
    var chart

    console.log('dashboard')

    _this.getOrders = function(){
      console.log('dashboard#getOrders')
      OrderFactory.getOrders((data) =>{
        console.log('data', data)
        if(data.status){
          _this.orders = data.orders
        }
      })

    }


}})()
