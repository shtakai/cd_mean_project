

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const PollSchema = new Schema({
  question: {
    type: String,
    required: true,
    minlength: 8,
  },
  option1: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  },
  option2: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  },
  option3: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  },
  option4: {
    type: Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  },
  _user:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }


},{ timestamps: {createdAt: 'created_at', updatedAt:'updated_at'} })


// register
//
mongoose.model('Poll', PollSchema)
