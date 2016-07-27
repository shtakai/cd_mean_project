

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const OrderSchema = new Schema({
  orderType: {
    type: String,
    enum: ['SELL', 'BUY'],
    required: true,
  },
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  amount: {
    type: Number,
    min: 1,
    required: true,
  },
  price: {
    type: Number,
    min: 1,
    required: true
  },
  traded: {
    type: Boolean,
    required: true,
    default: false,
  },
  traded_at: {
    type: Date,
  },
  canceled: {
    type: Boolean,
    required: true,
    default: false,
  },
  canceled_at: {
    type: Date,
  },
  _user:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  //TODO: settlement


},{ timestamps: {createdAt: 'created_at', updatedAt:'updated_at'} })


// register
//
mongoose.model('Order', OrderSchema)
