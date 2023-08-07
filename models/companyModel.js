const mongoose = require('mongoose');

// const linkSchema = new mongoose.Schema({
//   name: { type: String },
//   url: { type: String },
// });

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Company must have a name'],
    // unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  links: [String],
  image: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: 'Bahrain',
  },
  // targetId: {
  //   type: String,
  //   select: false,
  // },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  lastUpdate: {
    type: Date,
    default: Date.now(),
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

companySchema.index({ name: 1, country: 1 }, { unique: true });

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
