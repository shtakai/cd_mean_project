


const mongoose = require('mongoose')
const Order = mongoose.model('Order')
const User = mongoose.model('User')
const ObjectId = mongoose.Schema.Types.ObjectId

module.exports = {
  //logout: (req, res) => {
     //req.session.destroy((err) => {
     //res.json({status:true, message:'logout'})
     //})
  //}
  create: (req, res) => {
    console.log('order#create')
    console.log('body', req.body)
    let order = new Order(req.body)
    const user_id = req.session['user_info']['id']
    console.log('user_id', user_id)
    order.state = 'AVAILABLE'
    console.log('order---', order)
    User.findOne({_id: user_id})
      .then( (user) => {
        order._user = user
        user.orders.push(order)
        return(user.save())
      } )
      .then( (user) => {
        console.log('order created')
        return( order.save() )
      } )
      .then( () =>{
        console.log('success: res')
        res.json({status:true, order: order})
      } )
      .catch( (err) => {
        console.log('err',err)
        res.json({status: false, errors:err})
      } )
  }, //end create
  index: (req, res) =>{
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
            console.log('finished grabbed orders')
            res.json({status: true, buyOrders: buyOrders, sellOrders: sellOrders})
          } )
      } )
      .catch( (err) => {
        console.log('error', err)
        res.json({status: false, errors: err})
      } )
  }, // end index
}