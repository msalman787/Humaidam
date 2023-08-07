const express = require('express');

const router = express.Router();
const vacancyController = require('../controllers/vacancyController');

router
  .route('/')
  .get(vacancyController.getAllVacancies)
  .post(vacancyController.createVacancy);

router
  .route('/:id')
  .get(vacancyController.getVacancy)
  .patch(vacancyController.updateVacancy)
  .delete(vacancyController.deleteVacancy);

module.exports = router;
