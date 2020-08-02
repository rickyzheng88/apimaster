const express = require('express');
const {
    getCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getCourses)
    .post(addCourse);

router.route('/:id')
    .get(getSingleCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;