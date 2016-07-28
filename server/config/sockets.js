console.log('read sockets')
//const users = require('./../controllers/users.js')
//const orders = require('./../controllers/orders.js')

module.exports = (server) => {
  let io = require('socket.io').listen(server)
  io.sockets.on('connection', (socket) => {
    console.log('00000socket connected')
    socket.on('test', (data) => {
      console.log('test get', data)
    })
  })
  return io
}
