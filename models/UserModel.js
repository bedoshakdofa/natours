const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Userschema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'plz enter vaild mail'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minlength: [8, 'password must not be less than 8 charcter'],
    select: false,
  },
  passwordconfirm: {
    type: String,
    required: [true, 'renter your password'],
    //works only on save and create
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password are not the same ',
    },
  },
  passwordChangedAt: Date,
});
Userschema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordconfirm = undefined;
});

Userschema.methods.CheckPassword = async function (
  candidatePass,
  userPassword,
) {
  return await bcrypt.compare(candidatePass, userPassword);
};

Userschema.methods.passwordchange = function (JWTtimeStamp) {
  if (this.passwordChangedAt) {
    const TimeChange = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTtimeStamp < TimeChange;
  }
  return false;
};
const User = mongoose.model('User', Userschema);
module.exports = User;
