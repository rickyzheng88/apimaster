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
const router = express.Router();

//Load other resource router
const courseRouter = require('./course');

//Re-Route to other resource router
router.use('/:bootcampId/courses', courseRouter);

router.route('/')
    .get(advancedResults(bootcampModel, 'courses'), getBootcamps)
    .post(createBootcamp)
    .delete(deleteBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

router.route('/:id/photo')
    .put(bootcampPhotoUpload);

module.exports = router;