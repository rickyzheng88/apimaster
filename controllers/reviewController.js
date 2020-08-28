const customError = require('../utils/errors/customError');
const modelError = require('../utils/errors/modelError');
const bootcampModel = require('../models/bootcampModel');
const reviewModel = require('../models/reviewModel'); 

// @desc    Get reviews
// @route   GET /api/v1/bootcamp/:bootcampId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
    try {
        if (req.params.bootcampId) {
            const review = await reviewModel.find({ bootcamp: req.params.bootcampId });
    
            if (!review) {
                return next(new modelError("RESOURCE_NOT_FOUND"));
            }
    
            res.status(200).json({
                success: true,
                count: review.length,
                data: review
            })
        } else {
            res.status(200).json(res.advancedResults);
        }
    } catch (err) {
        console.log(err);
        next(new customError('INTERNAL_SERVER_ERROR', 500, 'Something is wrong'));
    }
    
};

// @desc    Get single review
// @route   GET /api/v1/review/:id
// @access  Public
exports.getSingleReview = async (req, res, next) => {
    try {
    const review = await reviewModel.findById(req.params.id).populate({
        path: 'Bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(new modelError('RESOURCE_NOT_FOUND'));
    }

    res.status(200).json({
        success: true,
        data: review
    });
    } catch (err) {
        console.log(err);
        next(new customError('INTERNAL_SERVER_ERROR', 500, 'Something is wrong'));
    }
};

// @desc    create a review
// @route   POST /api/v1/bootcamp/:bootcampId/reviews
// @access  Private/user/admin
exports.createReview = async (req, res, next) => {
    try {
        const bootcamp = await bootcampModel.findById(req.params.bootcampId);

        if (!bootcamp) {
            return next(new modelError("RESOURCE_NOT_FOUND"));
        }

        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        if (req.user.role !== 'admin' && req.user.role !== 'user') {
            return next(new customError("INVALID_CREDENTIALS", 403, "does not have permisson to do this action"));
        }

        const review = await reviewModel.create({

        })

        res.status(200).json({
            success: true,
            data: ""
        });
    } catch (err) {
        next(new customError('INTERNAL_SERVER_ERROR', 500, 'Something is wrong'));
    }
};