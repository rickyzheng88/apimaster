const customError = require('../utils/errors/customError');
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        required: [true, "Please add a title"],
        type: String,
        trim: true,
        maxlength: 100
    },
    text: {
        required: [true, "please add a text"],
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "please add a rating"]
    },
    bootcamp: {
        required: true,
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp'
    },
    user: {
        required: true,
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Review', reviewSchema);