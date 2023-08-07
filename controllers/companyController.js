// const fs = require('fs');
const Company = require('../models/companyModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCompanies = async (req, res) => {
  try {
    // Execute Query
    const features = new APIFeatures(Company.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const companies = await features.query;

    res.set('Access-Control-Allow-Origin', 'http://s3.alibond.dynu.com:3000');

    // Send Response
    res.status(200).json({
      status: 'success',
      results: companies.length,
      data: {
        companies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getCompany = async (req, res) => {
  try {
    // const tour = await Tour.findById(req.params.id);
    const company = await Company.findOne({
      _id: req.params.id,
    });

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        company: newCompany,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err, //'Invalid data sent!',
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        company,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err, //'Invalid data sent!',
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
