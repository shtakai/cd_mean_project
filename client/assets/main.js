console.log('main.js')
var socket
$(document).ready(function(){
  socket = io.connect();
  socket.emit('test', {data: '-------'})
  socket.on('test', (data) => {
    console.log('---test', data)
  })
  socket.on('orderUpdate', (data) => {
    console.log('updated orders', data)
    let sellHtml = ''
    _.each(_.orderBy(data.orders.sellOrders, '_id', 'desc'), (order) => {
      console.log('sell order', order)
      sellHtml += `<li class="list-group-item">Price: ${order._id} / Amount: ${order.count}</li>`
    })
    console.log('sellHtml', sellHtml)
    $('#sellOrders').html(sellHtml)
    let buyHtml = ''
    _.each(_.orderBy(data.orders.buyOrders, '_id', 'desc'), (order) => {
      console.log('buy order', order)
      buyHtml += `<li class="list-group-item">Price: ${order._id} / Amount: ${order.count}</li>`
    })
    console.log('buyHtml', buyHtml)
    $('#buyOrders').html(buyHtml)
  })
})
