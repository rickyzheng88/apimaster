const express = require('express');
const { 
    getBootcamp,
    getBootcamps,
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

module.exports = router;