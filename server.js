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
  saveUninitialized:true
}))

require('./server/config/mongoose.js')
require('./server/config/routes.js')(app)

const server = app.listen(port, () => {
  console.log('---server---start----8000')
})
