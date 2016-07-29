
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

    _this.sellOrder = function(){
      console.log('DashboardController#sellOrder')
      _this.sell.orderType = 'sell'
      OrderFactory.order(_this.sell, (data) => {
        console.log('data', data)
        _this.sell = {}
      })
    }

    _this.buyOrder = function(){
      console.log('DashboardController#buyOrder')
      _this.buy.orderType = 'buy'
      OrderFactory.order(_this.buy, (data) => {
        console.log('data', data)
        _this.buy = {}
      })
    }

}})()
