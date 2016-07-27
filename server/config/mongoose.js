const dbURL = 'mongodb://localhost/poqemon_ex_production'
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const reg = new RegExp('.js$', 'i')

mongoose.connect(dbURL)

const modelsPath = path.join( __dirname, './../models' )

// Connection event

// successfully connected
mongoose.connection.on( 'connected', () => {
  console.log(`Mongoose default connection opened to ${dbURL}`)
} )

// connection throws an error
mongoose.connection.on( 'error', (err) => {
  console.error(`Mongoose default connection error: ${err}`)
} )

// connection is disconnected
mongoose.connection.on( 'disconnected', () => {
  console.log(`Mongoose default connection disconnected`)
} )

/*
 * if the node process ends, close the Mongoose connection
 */
process.on( 'SIGINT', () => {
  mongoose.connection.close( () => {
    console.log(`Mongoose default connection disconnected through app termination`)
  } )
} )

/*
 * read all of the files in the models dir
 *  and dheck if it is a javascript file before requiring it
 */
fs.readdirSync(modelsPath).forEach( (file) => {
  if( reg.test( file )){
    require(`${modelsPath}/${file}`)
  }
} )

