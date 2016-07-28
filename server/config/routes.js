console.log('read routes')
const users = require('./../controllers/users.js')
const orders = require('./../controllers/orders.js')

module.exports = (app, io) => {
  app.set('io', io)
  app.post('/login', users.login)
  app.get('/logout', users.logout)
  app.get('/session', users.session)

  app.get('/orders', orders.index)
  app.post('/orders', orders.create)

  app.get('/test', (req, res) => {
    console.log('test')
    io.emit('test', {data: 'sashmi'})
    res.json({status:true, data: 'ok'})
  })
}
