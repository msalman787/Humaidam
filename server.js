const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// const env = {
//   NODE_ENV: 'development',
//   PORT: '3001',
//   USERNAME: 'amh',
//   PASSWORD: '123456',
//   DATABASE: 'mongodb+srv://amh:<PASSWORD>@cluster0.wn0zfbk.mongodb.net/jobsdb',
//   DATABASE_LOCAL: 'mongodb:',
//   DATABASE_PASSWORD: '1rjhvx2gZhdaCBDo',
// };

const DEFAULT_PORT = 3001;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// const DB = env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful.');
  });

// START THE SERVER
const port = process.env.PORT || DEFAULT_PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
