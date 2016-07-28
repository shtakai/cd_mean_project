const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()

const port = 8000


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, './client')))
app.use(express.static(path.join(__dirname, './bower_components')))

app.use(session({
  secret: '_____------',
  resave:false,
  saveUninitialized:true,
  store: require('mongoose-session')(require('mongoose'))
}))

require('./server/config/mongoose.js')




// get an instance of the router for api routes
const apiRoutes = express.Router();

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  console.log('middleware')

  // check header or url parameters or post parameters for token
  const userInfo = req.session['user_info']

  // decode token
  if (userInfo) {
    console.log('token exist')
    next();
  } else {

    // return an error
    return res.status(403).send({
      success: false,
      message: 'you have to log in'
    });

  }
});

app.use('/orders', apiRoutes)
const server = app.listen(port, () => {
  console.log('---server---start----8000')
})



let io = require('./server/config/sockets.js')(server)
require('./server/config/routes.js')(app, io)




