console.log('order helper')

const mongoose = require('mongoose')
const Order = mongoose.model('Order')

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



}
