const mongoose = require('mongoose');
const crypto = require('crypto');
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
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'lead-guide', 'guide', 'user'],
  },
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
  restToken: String,
  passowrdTokenEXP: String,
  active: {
    type: Boolean,
    default: true,
  },
});
Userschema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordconfirm = undefined;
});

Userschema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

Userschema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 6000;
  next();
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

Userschema.methods.passwordrestToken = function () {
  const restoken = crypto.randomBytes(64).toString('hex');
  this.restToken = crypto.createHash('sha256').update(restoken).digest('hex');
  this.passowrdTokenEXP = Date.now() + 10 * 60 * 1000;

  return restoken;
};
const User = mongoose.model('User', Userschema);
module.exports = User;
