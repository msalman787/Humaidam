const mongoose = require('mongoose');

const CompanyRequestsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Company must have a name'],
    trim: true,
  },
  description: String,
  link: String,
  country: {
    type: String,
    default: 'BH',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

const CompanyRequests = mongoose.model(
  'CompanyRequests',
  CompanyRequestsSchema
);
module.exports = CompanyRequests;
