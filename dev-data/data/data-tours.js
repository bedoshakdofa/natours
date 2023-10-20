const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
dotenv.config({ path: './config.env' });
//read file
const data = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));
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
    await Tour.create(data);
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
