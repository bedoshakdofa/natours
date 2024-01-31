const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const user = require('./../../models/UserModel');
const Reviews = require('./../../models/ReviewsModel');
dotenv.config({ path: './config.env' });
//read file
const tour = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));
//connecting to database
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('database is successfully connected'));

//importing data
const importdata = async () => {
  try {
    await Tour.create(tour);
    await user.create(users, { validateBeforeSave: false });
    await Reviews.create(reviews);
    console.log('data is imported succssfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//deleteing all data

const deletedata = async () => {
  try {
    await Tour.deleteMany();
    await user.deleteMany();
    await Reviews.deleteMany();
    console.log('data has been deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
//choose operation
if (process.argv[2] === '--import') {
  importdata();
} else if (process.argv[2] === '--delete') {
  deletedata();
}
