console.log('order helper')

const mongoose = require('mongoose')
const Order = mongoose.model('Order')
const User = mongoose.model('User')
const _ = require('lodash')

module.exports = {
  getOrders: (callback) => {
    console.log('OrderHelper#getOrders')

    const sell = Order.aggregate([
      {
        $match: {
          orderType: 'SELL',
          traded: false,
          canceled: false,
          state: 'AVAILABLE',
        }
      },
      {
        $group: {
          _id: '$price',
          count: {$sum: "$amount"}
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          price: 1,
        }
      }
    ])

    const buy = Order.aggregate([
      {
        $match: {
          orderType: 'BUY',
          traded: false,
          canceled: false,
          state: 'AVAILABLE',
        }
      },
      {
        $group: {
          _id: '$price',
          count: {$sum: "$amount"}
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          price: 1,
        }
      }
    ])

    let sellOrders
    let buyOrders
    //Order.find({traded: false, canceled: false, orderType: 'SELL', state: 'AVAILABLE'})
    sell.exec()
    //.sort('-created_at')
      .then( (_sellOrders) => {
        console.log('sell order', _sellOrders)
        sellOrders = _sellOrders
        return _sellOrders
      } )
      .then( () => {
        //Order.find({traded:false, canceled: false, orderType: 'BUY' ,state: 'AVAILABLE'})
        buy.exec()
          .then( (_buyOrders) => {
            buyOrders = _buyOrders
            _.each(buyOrders, (o) => {
              console.log('buy:', o)
            })
            _.each(sellOrders, (o) => {
              console.log('sel:', o)
            })
            console.log(
              JSON.stringify({
                buyOrders: buyOrders, sellOrders: sellOrders
              })
            )
            // TODO: fix
            callback({status: true, orders: {
              buyOrders: buyOrders, sellOrders: sellOrders
            }})
          } )
      } )
      .catch( (err) => {
        console.log('error', err)
        callback({status: false, errors: err})
      } )
  }, // end index

  execOrder: (order, callback) => {
    console.log('OrderHelper#execOrder')
    let position = order.orderType
    let query = Order.find({
      orderType: { $ne: position},
      traded: false,
      canceled: false,
      price: order.price,
      state: 'AVAILABLE',
    })
    query.select({
      _id: 1,
      amount:1,
      state: 1,
    })
    query.sort({created_at: 1})
    query.exec()
      .then((orders) => {
        for(let _order of orders){
          console.log('_order', _order.id, _order.amount, _order.state)
          if(_order.state !== 'AVAILABLE'){
            continue
          }
          console.log('update')
          Order.where({
              _id: _order._id
            }).update(
              {
                $set: {
                  state: 'PROCESSING'
                }
              }
            ).exec()
          console.log('order.amount', order.amount)
          console.log('_order.amount', _order.amount)
          let reduceAmount
          reduceAmount = (order.amount > _order.amount) ? _order.amount : order.amount
          console.log('erase')
          console.log('reduceAmount', reduceAmount, 'from', _order.amount, 'to', _order.amount - reduceAmount)

          if(order.amount >= _order.amount){
            Order.where({
                _id: _order._id
              }).update(
                {
                  $set: {
                    traded: true,
                    state: 'FINISHED',
                    traded_at: Date.now()
                  }
                }
              ).exec()

          } else {
            console.log('00000000000000000000')
            Order.where({
                _id: _order._id
              }).update(
                {
                  $set: {
                    tradeded: false,
                    amount: _order.amount - reduceAmount,
                    state: 'AVAILABLE',
                  }
                }
              ).exec()

          }

          console.log('erased')
          order.amount -= reduceAmount
          if(order.amount <= 0){
            Order.where({
                _id: order._id
              }).update(
                {
                  $set: {
                    traded: true,
                    state: 'FINISHED',
                    traded_at: Date.now()
                  }
                }
              ).exec()
            console.log('finished')
            break
          } else{
            Order.where({
                _id: order._id
              }).update(
                {
                  $set: {
                    amount: order.amount - reduceAmount,
                  }
                }
              ).exec()

          }

        }

        console.log('finished＝＝＝＝')
        let finished = order.amount <= 0 ? true : false
        callback({finished: finished})


      })


  } , // end execOrder


}
