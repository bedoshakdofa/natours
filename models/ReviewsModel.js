const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewsSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, "review can't be empty!!"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true],
  },
  tour: {
    type: mongoose.Types.ObjectId,
    ref: 'tour',
    required: [true],
  },
});

reviewsSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nrating: { $sum: 1 },
        AverageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nrating,
      ratingsAverage: stats[0].AverageRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewsSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewsSchema.post('save', function () {
  this.constructor.calcAverageRating(this.tour);
});

reviewsSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewsSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRating(this.r.tour);
});

reviewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo ',
  });
  next();
});

const Reviews = mongoose.model('Reviews', reviewsSchema);

module.exports = Reviews;
