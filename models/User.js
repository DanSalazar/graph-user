const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  description: String,
  password: {
    type: String,
    minLength: 6
  }
})

module.exports = model('User', UserSchema)
