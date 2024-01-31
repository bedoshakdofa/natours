const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [40, 'the name should not exced 40 char'],
      minlength: [5, 'not enough char for name'],
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
      enum: {
        values: ['easy', 'difficult', 'medium'],
        message: 'the difficulty must be easy , difficult or medium',
      },
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
    slug: String,
    price: {
      type: Number,
      required: [true, 'there must be price'],
    },
    startDates: [Date],
    SecretTOur: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        address: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// tourSchema.virtual('durationweeks').get(function () {
//   return this.duration / 7;
// });

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('review', {
  ref: 'Reviews',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function (next) {
  this.find({ SecretTOur: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v',
  });
  next();
});

// tourSchema.pre('save', async function (next) {
//   this.guides = await Promise.all(
//     this.guides.map(async (id) => {
//       await User.findById(id);
//     }),
//   );

//   next();
// });

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { SecretTOur: { $ne: true } } });
//   next();
// });

const tour = mongoose.model('tour', tourSchema);

module.exports = tour;
