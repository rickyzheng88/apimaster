const express = require('express');
const { 
    getReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

const reviewModel = require('../models/reviewModel');

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(advancedResults(reviewModel, {
        path: 'Bootcamp',
        select: 'name description'
    }), getReviews)
    .post(protect, authorize('admin', 'user'), createReview);

router.route('/:id')
    .get(getSingleReview)
    .put(protect, authorize('admin', 'user'), updateReview)
    .delete(protect, authorize('admin', 'user'), deleteReview);

module.exports = router;