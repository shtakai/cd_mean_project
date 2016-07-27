console.log('read routes')
const users = require('./../controllers/users.js')
const polls = require('./../controllers/polls.js')

module.exports = (app) => {
  app.post('/login', users.login)
  app.get('/logout', users.logout)
  app.get('/session', users.session)

  app.get('/polls/:id', polls.show)
  app.get('/polls', polls.index)
  app.post('/polls', polls.create)
  app.delete('/polls/:id', polls.destroy)
  app.get('/options/:id/vote', polls.vote)
}
