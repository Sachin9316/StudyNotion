const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    courseDuration: {
        type: String,
    },
    instructor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    whaYouWillLearb: {
        type: String,
        trim: true,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    }],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    tag: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    studentsEnrolled: [{
        type: mongoose.Schema.type.ObjectId,
        required: true,
        ref: 'User',
    }],

})

module.exports = mongoose.model('Course', courseSchema);