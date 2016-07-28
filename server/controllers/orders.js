


const mongoose = require('mongoose')
const Order = mongoose.model('Order')
const User = mongoose.model('User')
const ObjectId = mongoose.Schema.Types.ObjectId

const OrderHelper = require('./../helpers/order.helper.js')

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
        //OrderHelper.getOrders()
        OrderHelper.getOrders( (data) => {
          if(data.status){
            let io = req.app.get('io')
            io.emit('orderUpdate', data)
          }
        } )
        res.json({status:true, order: order})
      } )
      .catch( (err) => {
        console.log('err',err)
        res.json({status: false, errors:err})
      } )
  }, //end create
  index: (req, res) => {
    OrderHelper.getOrders( (data) => {
      res.json(data)
    } )
  }


}
