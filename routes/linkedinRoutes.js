const express = require('express');

const router = express.Router();
const linkedinController = require('../controllers/linkedinController');

router.route('/scrape').get(linkedinController.ScrapeVacancies);
router.route('/UpdateAll').get(linkedinController.UpdateAllVacancies);
// router.route('/:id').get(linkedinController.findVacancies);

module.exports = router;
