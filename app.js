const express = require('express');
const morgan = require('morgan');
// const cors = require('cors');

const companyRouter = require('./routes/companyRoutes');
const vacancyRouter = require('./routes/vacancyRoutes');
const linkedinRouter = require('./routes/linkedinRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // middleware #1
}

// app.use(cors()); // Use cors middleware to enable CORS for all routes

app.use(express.json()); // middleware #2
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/vacancies', vacancyRouter);
app.use('/api/v1/linkedin', linkedinRouter);

module.exports = app;
