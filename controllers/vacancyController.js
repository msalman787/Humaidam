// const fs = require('fs');
const Vacancy = require('../models/vacancyModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllVacancies = async (req, res) => {
  try {
    // Execute Query
    const features = new APIFeatures(Vacancy.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const vacancies = await features.query.populate('Company', 'name'); //'-_id name'

    // Send Response
    res.set('Access-Control-Allow-Origin', 'http://s3.alibond.dynu.com:3000');
    res.status(200).json({
      status: 'success',
      results: vacancies.length,
      data: {
        vacancies,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getVacancy = async (req, res) => {
  try {
    // const tour = await Tour.findById(req.params.id);
    const vacancy = await Vacancy.findOne({
      _id: req.params.id,
    }).populate('Company');

    res.status(200).json({
      status: 'success',
      data: {
        vacancy,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createVacancy = async (req, res) => {
  try {
    const newVacancy = await Vacancy.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        vacancy: newVacancy,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err, //'Invalid data sent!',
    });
  }
};

exports.updateVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        vacancy,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err, //'Invalid data sent!',
    });
  }
};

exports.deleteVacancy = async (req, res) => {
  try {
    await Vacancy.findByIdAndDelete(req.params.id);

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
