const mongoose = require('mongoose');
const colors = require('colors');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    weeks: {
        type: Number,
        required: [true, "Please add a duration for the course"]
    },
    tuition: {
        type: Number,
        required: [true, "Please add a tuition cost"]
    },
    minimumSkill: {
        type: String,
        enum: ["beginner", "intermediate", "expert"],
        required: [true, "Please add the minimum skill required"]
    },
    scholarShipsAvailable: {
        type: Boolean,
        default: false
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Static method to get Average of Course Tuitions
courseSchema.statics.getAverageCost = async function(bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        }, {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
           averageCost: Math.ceil(obj[0].averageCost / 10) * 10 
        });
    } catch (err) {
        console.error(err);
    }
}

// call averageCost after save
courseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp);
});

// Call averageCost before remove
courseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", courseSchema);