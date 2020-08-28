const express = require('express');
const {
    getReviews,
    getSingleReview
} = require('../controllers/reviewController');

const reviewModel = require('../models/reviewModel');

const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(advancedResults(reviewModel, {
        path: 'Bootcamp',
        select: 'name description'
    }), getReviews);

router.route('/:id')
    .get(getSingleReview);

module.exports = router;