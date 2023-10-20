const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'there must be a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'there must be a max groub size'],
  },
  difficulty: {
    type: String,
    required: [true, 'there must be a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: String,
    default: 0,
  },
  summary: {
    type: String,
    required: [true, 'there must be a summery'],
    tirm: true,
  },
  description: {
    type: String,
    required: [true, 'there must be a description'],
    tirm: true,
  },
  imageCover: {
    type: String,
    required: [true, 'there must be a imagecover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  priceDiscount: Number,
  price: {
    type: Number,
    required: [true, 'there must be price'],
  },
  startDate: [Date],
});

const tour = mongoose.model('tour', tourSchema);

module.exports = tour;
