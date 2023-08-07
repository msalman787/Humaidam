const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('../models/companyModel');
const Vacancy = require('../models/vacancyModel');

dotenv.config({ path: '../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful.');
  });

//Import data
const importData = async () => {
  // READ JSON FILE
  const companies = JSON.parse(
    fs.readFileSync(`${__dirname}/companiesv1.json`, 'utf-8')
    // fs.readFileSync(`${__dirname}/companies_min.json`, 'utf-8')
  );
  try {
    await Company.create(companies);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all existing data from DB
const deleteData = async () => {
  try {
    await Company.deleteMany();
    await Vacancy.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log();
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log('Please use --delete or --import');
}
