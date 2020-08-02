const courseModel = require('../models/courseModel');
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
}