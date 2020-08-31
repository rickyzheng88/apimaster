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

// Static method to get Average of Bootcamp Ratings
reviewSchema.statics.getAverageRating = async function(bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        }, {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
           averageRating: obj[0].averageRating
        });
    } catch (err) {
        console.error(err);
    }
}

// call averageRating after save
reviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.bootcamp);
});

// Call averageRating before remove
reviewSchema.pre('remove', function(){
    this.constructor.getAverageRating(this.bootcamp);
});

reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);