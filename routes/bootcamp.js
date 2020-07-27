const express = require('express');
const { 
    getBootcamp,
    getBootcamps,
    getBootcampsInRadius,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require('../controllers/bootcampController');
const router = express.Router();

router.route('/')
    .get(getBootcamps)
    .post(createBootcamp)
    .delete(deleteBootcamp);

router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius);

module.exports = router;