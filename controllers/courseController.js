const courseModel = require('../models/courseModel');
const bootcampModel = require('../models/bootcampModel');
const modelError = require('../utils/errors/modelError');
const colors = require('colors');

// @desc      Get Courses
// @Route     GET /api/v1/courses
// @Route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = async (req, res, next) => {
    try {
        let query;

        if (req.params.bootcampId) {
            query = courseModel.find({ bootcamp: req.params.bootcampId });
        } else {
            query = courseModel.find().populate({
                path: 'bootcamp',
                select: 'name description'
            });
        }

        const courses = await query;

        res.status(200).json({
            sucess: true,
            count: courses.length,
            data: courses
        });
    } catch (err) {
        console.log(err, colors.red);
        next(new modelError("RESOURCE_NOT_RETRIEVED", err));
    }
};

// @desc      Get single Course
// @Route     GET /api/v1/courses/:id
// @access    Public
exports.getSingleCourse = async (req, res, next) => {
    try {
        const courses = await courseModel.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description'
        });

        if (!courses) {
            next(new modelError("RESOURCE_NOT_FOUND"));
        }

        res.status(200).json({
            sucess: true,
            data: courses
        });
    } catch (err) {
        console.log(err, colors.red);
        next(new modelError("RESOURCE_NOT_RETRIEVED", err));
    }
};

// @desc      Add a Course
// @Route     POST /api/v1/bootcamp/:bootcampId/courses
// @access    Private
exports.addCourse = async (req, res, next) => {
    try {
        req.body.bootcamp = req.params.bootcampId;

        const bootcamp = await bootcampModel.findById(req.params.bootcampId);

        if (!bootcamp) {
            next(new modelError("RESOURCE_NOT_FOUND"));
        }

        const course = await courseModel.create(req.body);

        res.status(201).json({
            sucess: true,
            data: course
        });
    } catch (err) {
        console.log(err, colors.red);
        next(new modelError("RESOURCE_NOT_CREATED", err));
    }
};

// @desc      Update a Course
// @Route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await courseModel.findById(req.params.id);

        if (!course) {
            next(new modelError("RESOURCE_NOT_FOUND"));
        }

        course = await courseModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            sucess: true,
            data: course
        });
    } catch (err) {
        console.log(err, colors.red);
        next(new modelError("RESOURCE_NOT_UPDATED", err));
    }
};

// @desc      delete a Course
// @Route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = async (req, res, next) => {
    try {
        let course = await courseModel.findById(req.params.id);

        if (!course) {
            next(new modelError("RESOURCE_NOT_FOUND"));
        }

        await course.remove();

        res.status(200).json({
            sucess: true,
            data: `course: course deleted`
        });
    } catch (err) {
        console.log(err, colors.red);
        next(new modelError("RESOURCE_NOT_DELETED", err));
    }
};