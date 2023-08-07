const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A vacancy must have a title'],
      trim: true,
    },
    description: String,
    link: String,
    Company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    country: {
      type: String,
      default: 'BH',
    },
    seniority: String,
    employment: String,
    function: String,
    industries: String,
    posted: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    lastUpdated: Date,
    enabled: {
      type: Boolean,
      default: true,
    },
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);

// ShapesSchema.index({ title: 1, Company: 1 }, { unique: true });

const Vacancy = mongoose.model('Vacancy', vacancySchema);
module.exports = Vacancy;
