const customError = require('../utils/errors/customError');
const modelError = require('../utils/errors/modelError');
const bootcampModel = require('../models/bootcampModel');
const reviewModel = require('../models/reviewModel'); 
const UserError = require('../utils/errors/userError');

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
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        const bootcamp = await bootcampModel.findById(req.params.bootcampId);

        if (!bootcamp) {
            return next(new modelError("RESOURCE_NOT_FOUND"));
        }
        
        let review = {}
        try {
            review = await reviewModel.create(req.body);
        } catch (err) {
            console.log(err);
            return next(new customError('DUBLICATE_USER_REVIEW', 400, "user can not submit more than one review per bootcamp"));
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

// @desc    Update a review
// @route   PUT /api/v1/review/:id
// @access  Private/user/admin
exports.updateReview = async (req, res, next) => {
    try {
        const review = await reviewModel.findById(req.params.id);

        if (!review) {
            return next(new modelError('RESOURCE_NOT_FOUND'));
        }

        if (req.user.id !== review.user.toString() && req.user.role !== 'admin' ) {
            return next(new customError('NOT_AUTHORIZED'), 403, 'User does not have permisson to make this action');
        }

        // Avoid users changing the owner of the review, and the bootcamp
        delete req.body.bootcamp;
        delete req.body.user;

        const newReview = await reviewModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: newReview
        });
    } catch (err) {
        console.log(err);
        next(new customError('INTERNAL_SERVER_ERROR', 500, 'Something is wrong'));
    }
};

// @desc    Delete a review
// @route   DELETE /api/v1/review/:id
// @access  Private/user/admin
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await reviewModel.findById(req.params.id);

        if (!review) {
            return next(new modelError('RESOURCE_NOT_FOUND'));
        }

        if (req.user.id !== review.user.toString() && req.user.role !== 'admin' ) {
            return next(new customError('NOT_AUTHORIZED'), 403, 'User does not have permisson to make this action');
        }

        review.remove();

        res.status(200).json({
            success: true,
            data: 'review has been deleted'
        });
    } catch (err) {
        console.log(err);
        next(new customError('INTERNAL_SERVER_ERROR', 500, 'Something is wrong'));
    }
};