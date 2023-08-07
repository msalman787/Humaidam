const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('../models/companyModel');
const Vacancy = require('../models/vacancyModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful.');
  });

//load companies link
// Function to fetch all companies from the database
async function getAllCompanies() {
  try {
    const companies = await Company.find();
    console.log(`Loading companies data ... [${companies.length}]`);
    return companies;
  } catch (err) {
    console.error('Error getting all companies', err);
    throw err;
  }
}

console.log(getAllCompanies());

/*
// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all existing data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
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
*/
