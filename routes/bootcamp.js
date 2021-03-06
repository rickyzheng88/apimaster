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
const reviewRouter = require('./review');

//Re-Route to other resource router
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/')
    .get(advancedResults(bootcampModel, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router.route('/:id')
    .get(getBootcamp);
    
router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;