

console.log('option model')

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const OptionSchema = new Schema({
  vote: {
    type: Number,
    default: 0,
  },
  option:{
    type: String,
    required: true,
    minlength: 3
  },

},{ timestamps: {createdAt: 'created_at', updatedAt:'updated_at'} })



// register
//
mongoose.model('Option', OptionSchema)
