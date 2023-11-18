const mongoose = require('mongoose');

//User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }, // Default role is 'user'
  followers: {
    type: [ //Collection of users who are followers
      {
        type: mongoose.Schema.Types.ObjectId,//foreign key
        ref: 'User',
      },
    ], default: []
  },
  notifications: { //collection of notif object
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ], default: []
  },
  isBlocked: {//only admin can change this property
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;