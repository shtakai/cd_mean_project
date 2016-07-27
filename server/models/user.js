
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  orders:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }

  ],

},{ timestamps: {createdAt: 'created_at', updatedAt:'updated_at'} })

//register
mongoose.model('User', UserSchema)
