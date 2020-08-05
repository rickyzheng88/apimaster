const express = require('express');
const {
    getCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const advancedResults = require('../middleware/advancedResults');
const courseModel = require('../models/courseModel');
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(advancedResults(courseModel, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(addCourse);

router.route('/:id')
    .get(getSingleCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;