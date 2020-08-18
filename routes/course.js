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
const { protect, authorize } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(advancedResults(courseModel, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(protect, authorize('publisher', 'admin'), addCourse);

router.route('/:id')
    .get(getSingleCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;