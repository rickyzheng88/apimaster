const express = require('express');
const { 
    getBootcamp,
    getBootcamps,
    getBootcampsInRadius,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload
} = require('../controllers/bootcampController');
const bootcampModel = require('../models/bootcampModel');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

//Load other resource router
const courseRouter = require('./course');

//Re-Route to other resource router
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .get(advancedResults(bootcampModel, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;